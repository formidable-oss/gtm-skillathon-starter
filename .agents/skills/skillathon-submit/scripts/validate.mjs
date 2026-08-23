#!/usr/bin/env node
// Canonical GTM Skillathon submission validator. Zero dependencies, Node >= 18.
//
// Usage: node validate.mjs [repo-dir] [--json]
// Exit 0 when there are no errors, 1 otherwise. Warnings never fail.
//
// The submission system runs this exact script against the submitted commit, so a local
// pass here means a remote pass there. Checks mirror the "Valid structure" and "Clean"
// gates in RULES.md. Secret findings report path and line only, never the value.

import { readFileSync, statSync, existsSync, readdirSync } from "node:fs";
import { join, relative, basename, dirname, resolve, sep } from "node:path";
import { execFileSync } from "node:child_process";

const TRACKS = [
  "ai-search-optimization",
  "personalized-growth-engines",
  "churn-detection",
  "synthetic-buyer-simulations",
  "plg-automation",
  "multi-agent-orchestration",
  "custom",
];
const ORGANIZER_SKILLS = new Set(["skillathon-guide", "skillathon-submit"]);
// Template placeholders: TODO at the start of a value (after **label**, a colon, a table pipe, a
// JSON quote, a $ or a path separator, or at line start). Plain prose such as "TODO items" passes.
const PLACEHOLDER = /(?:\*\*\s*|:\s*|\|\s*|"\s*|\$|\/|^\s*)TODO\b/m;
const SKILL_PATH = /^\.agents\/skills\/([a-z0-9]+(?:-[a-z0-9]+)*)\/SKILL\.md$/;
const SECRET_PATTERNS = [
  ["OpenAI key", /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b/],
  ["Anthropic key", /\bsk-ant-[A-Za-z0-9_-]{20,}\b/],
  ["GitHub token", /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{30,}\b|\bgithub_pat_[A-Za-z0-9_]{20,}\b/],
  ["AWS key", /\bAKIA[0-9A-Z]{16}\b/],
  ["Apify token", /\bapify_api_[A-Za-z0-9]{20,}\b/],
  ["Slack token", /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/],
  ["Private key", /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ["Credential URL", /\b[a-z]+:\/\/[^\s/:@]+:[^\s/@]+@[^\s]+/i],
];
const PLACEHOLDER_SECRET = /x{6,}|your[-_ ]|example|changeme|placeholder|localhost|127\.0\.0\.1|<[^>]+>/i;
const MAX_DATA_BYTES = 25 * 1024 * 1024;

const args = process.argv.slice(2);
const asJson = args.includes("--json");
const root = resolve(args.find((a) => !a.startsWith("--")) ?? ".");

const errors = [];
const warnings = [];
const err = (code, message, path) => errors.push({ code, message, ...(path ? { path } : {}) });
const warn = (code, message, path) => warnings.push({ code, message, ...(path ? { path } : {}) });

const abs = (p) => join(root, p);
const isInside = (p) => !relative(root, resolve(root, p)).startsWith("..");
const read = (p) => readFileSync(abs(p), "utf8");
const exists = (p) => isInside(p) && existsSync(abs(p));
const isDir = (p) => exists(p) && statSync(abs(p)).isDirectory();
const nonEmptyString = (v) => typeof v === "string" && v.trim().length > 0;
const hasPlaceholder = (v) => typeof v === "string" && PLACEHOLDER.test(v);

// ---- tracked files -----------------------------------------------------------------
function trackedFiles() {
  try {
    const out = execFileSync("git", ["-C", root, "ls-files", "-z"], { encoding: "utf8" });
    return out.split("\0").filter(Boolean);
  } catch {
    const files = [];
    const walk = (dir) => {
      for (const entry of readdirSync(abs(dir), { withFileTypes: true })) {
        const rel = dir ? `${dir}/${entry.name}` : entry.name;
        if ([".git", "node_modules", ".venv", "venv", "__pycache__", "dist", "build"].includes(entry.name)) continue;
        if (entry.isDirectory()) walk(rel);
        else files.push(rel);
      }
    };
    walk("");
    return files;
  }
}
const tracked = trackedFiles();

// ---- submission.json ---------------------------------------------------------------
let manifest = null;
if (!exists("submission.json")) {
  err("manifest-missing", "submission.json not found", "submission.json");
} else {
  const raw = read("submission.json");
  try {
    manifest = JSON.parse(raw);
  } catch (e) {
    err("manifest-invalid-json", `submission.json is not valid JSON: ${e.message}`, "submission.json");
  }
  if (hasPlaceholder(raw)) err("manifest-placeholder", "submission.json still contains TODO", "submission.json");
}

const summary = { team: null, members: [], track: null, problem: null, entry_skill: null, skills: [] };

if (manifest) {
  if (manifest.schema_version !== 2) err("schema-version", "schema_version must be 2", "submission.json");

  const team = manifest.team ?? {};
  if (!nonEmptyString(team.name)) err("team-name", "team.name is required", "submission.json");
  else summary.team = team.name.trim();
  if (!Array.isArray(team.members) || team.members.length < 1 || team.members.length > 2) {
    err("team-members", "team.members must list one or two names", "submission.json");
  } else if (!team.members.every(nonEmptyString)) {
    err("team-members", "every team member needs a non-empty name", "submission.json");
  } else summary.members = team.members.map((m) => m.trim());

  if (!TRACKS.includes(manifest.track)) err("track", `track must be one of: ${TRACKS.join(", ")}`, "submission.json");
  else summary.track = manifest.track;

  if (!nonEmptyString(manifest.problem)) err("problem", "problem must be one non-empty sentence", "submission.json");
  else summary.problem = manifest.problem.trim();

  // Skills
  const skills = Array.isArray(manifest.skills) ? manifest.skills : [];
  if (skills.length === 0) err("skills-empty", "skills must list at least the entry skill", "submission.json");
  if (skills.length > 3) warn("skills-many", `${skills.length} skills listed; more than three is rarely needed`, "submission.json");

  const skillNames = new Map();
  for (const skill of skills) {
    const path = skill?.path;
    if (!nonEmptyString(path)) { err("skill-path", "each skill needs a path", "submission.json"); continue; }
    const m = SKILL_PATH.exec(path);
    if (!m) { err("skill-path", "skill path must match .agents/skills/<lowercase-hyphen-name>/SKILL.md", path); continue; }
    const folder = m[1];
    if (ORGANIZER_SKILLS.has(folder)) { err("skill-organizer", `${folder} is organizer-provided and must not be listed in skills`, path); continue; }
    if (!nonEmptyString(skill.role)) err("skill-role", "each skill needs a one-line role", path);
    if (!exists(path)) { err("skill-missing", "skill file not found", path); continue; }
    const fm = parseFrontmatter(read(path), path);
    if (fm && fm.name !== folder) err("skill-name", `frontmatter name "${fm.name}" must equal folder name "${folder}"`, path);
    if (fm) skillNames.set(path, fm.name);
  }
  summary.skills = [...skillNames.values()];

  const entry = manifest.entry_skill;
  if (!nonEmptyString(entry) || !SKILL_PATH.test(entry)) {
    err("entry-skill", "entry_skill must be a path like .agents/skills/<name>/SKILL.md", "submission.json");
  } else if (!skills.some((s) => s?.path === entry)) {
    err("entry-skill-unlisted", "entry_skill must also appear in skills", "submission.json");
  } else if (skillNames.has(entry)) {
    summary.entry_skill = skillNames.get(entry);
  }

  // Skills on disk that are not declared
  if (isDir(".agents/skills")) {
    for (const d of readdirSync(abs(".agents/skills"), { withFileTypes: true })) {
      if (!d.isDirectory() || ORGANIZER_SKILLS.has(d.name)) continue;
      const p = `.agents/skills/${d.name}/SKILL.md`;
      if (!skills.some((s) => s?.path === p)) warn("skill-undeclared", "skill folder exists but is not listed in submission.json", p);
    }
  }

  // Seed prompt
  const seed = manifest.seed_prompt;
  if (!nonEmptyString(seed) || !exists(seed)) err("seed-missing", "seed_prompt file not found", seed ?? "submission.json");
  else {
    const text = read(seed).trim();
    if (!text) err("seed-empty", "seed prompt is empty", seed);
    if (hasPlaceholder(text)) err("seed-placeholder", "seed prompt still contains TODO", seed);
    if (summary.entry_skill && !text.includes(`$${summary.entry_skill}`)) {
      err("seed-no-entry", `seed prompt must invoke the entry skill as $${summary.entry_skill}`, seed);
    }
    const input = nonEmptyString(manifest.input) ? manifest.input.replace(/\/+$/, "") : "";
    if (input && !(text.includes(input) || (!isDir(input) && text.includes(basename(input))))) {
      err("seed-no-input", `seed prompt must name the input path (${input})`, seed);
    }
  }

  // Input and output
  checkArtifact("input", manifest.input);
  checkArtifact("output", manifest.output);

  // Evals
  const evals = manifest.evals;
  if (!nonEmptyString(evals) || !exists(evals)) err("evals-missing", "evals file not found", evals ?? "submission.json");
  else {
    const text = read(evals);
    if (hasPlaceholder(text)) err("evals-placeholder", "evals still contain TODO", evals);
    for (const label of ["Intended", "Insufficient evidence", "Failure"]) {
      if (!text.includes(label)) err("evals-case", `evals must contain the "${label}" case`, evals);
    }
    const judged = (text.match(/\|\s*(pass|fail)\s*\|/gi) ?? []).length;
    if (judged < 3) err("evals-judgment", `each of the three eval cases needs a pass or fail cell (found ${judged})`, evals);
  }

  // Run sheet
  const sheet = manifest.run_sheet ?? "DEMO.md";
  if (!exists(sheet)) err("run-sheet-missing", "run sheet not found", sheet);
  else if (hasPlaceholder(read(sheet))) err("run-sheet-placeholder", "run sheet still contains TODO", sheet);
}

function checkArtifact(kind, path) {
  if (!nonEmptyString(path)) { err(`${kind}-missing`, `${kind} path is required`, "submission.json"); return; }
  if (hasPlaceholder(path)) { err(`${kind}-placeholder`, `${kind} path still contains TODO`, "submission.json"); return; }
  if (!exists(path)) { err(`${kind}-missing`, `${kind} not found`, path); return; }
  if (isDir(path)) {
    const real = readdirSync(abs(path)).filter((f) => !/^(README\.md|\.gitkeep|\.DS_Store)$/i.test(f));
    if (real.length === 0) err(`${kind}-empty`, `${kind} directory contains only placeholders`, path);
  } else if (statSync(abs(path)).size === 0) {
    err(`${kind}-empty`, `${kind} file is empty`, path);
  }
  if (!tracked.includes(path) && !tracked.some((t) => t.startsWith(path.replace(/\/?$/, "/")))) {
    err(`${kind}-untracked`, `${kind} is not committed to git`, path);
  }
}

function parseFrontmatter(text, path) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(text);
  if (!m) { err("frontmatter-missing", "SKILL.md must start with YAML frontmatter", path); return null; }
  const fields = {};
  let last = null;
  for (const line of m[1].split(/\r?\n/)) {
    if (!line.trim()) continue;
    if (/^\s/.test(line) && last) { fields[last] = `${fields[last]} ${line.trim()}`.trim(); continue; } // YAML continuation line
    const kv = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(line);
    if (!kv) { err("frontmatter-invalid", `cannot parse frontmatter line "${line.slice(0, 40)}"; use "key: value" lines`, path); return null; }
    last = kv[1];
    fields[last] = kv[2].trim().replace(/^[>|][-+]?$/, "").replace(/^(['"])(.*)\1$/, "$2");
  }
  const keys = Object.keys(fields);
  const extra = keys.filter((k) => k !== "name" && k !== "description");
  if (extra.length) err("frontmatter-extra", `frontmatter may contain only name and description (found ${extra.join(", ")})`, path);
  if (!nonEmptyString(fields.name)) err("frontmatter-name", "frontmatter name is required", path);
  if (!nonEmptyString(fields.description)) err("frontmatter-description", "frontmatter description is required", path);
  else if (fields.description.length < 40) warn("frontmatter-description-short", "description should say what the skill does and when to trigger it", path);
  if (hasPlaceholder(m[1])) err("frontmatter-placeholder", "frontmatter still contains TODO", path);
  return fields;
}

// ---- clean: env files, secrets, size, licence ----------------------------------------
let totalBytes = 0;
for (const file of tracked) {
  const name = basename(file);
  if (/^\.env(\..+)?$/.test(name) && name !== ".env.example") err("env-file", "environment file is committed", file);
  let size = 0;
  try { size = statSync(abs(file)).size; } catch { continue; }
  totalBytes += size;
  if (size > 1024 * 1024 || /\.(png|jpe?g|gif|webp|pdf|zip|gz|mp4|mov|woff2?|ttf|ico)$/i.test(name)) continue;
  let text;
  try { text = readFileSync(abs(file), "utf8"); } catch { continue; }
  if (/\.example$|\.sample$/i.test(name)) continue;
  const lines = text.split("\n");
  for (const [label, re] of SECRET_PATTERNS) {
    for (let i = 0; i < lines.length; i++) {
      if (re.test(lines[i]) && !PLACEHOLDER_SECRET.test(lines[i])) { err("secret", `possible ${label} at line ${i + 1}; remove it and rotate the credential`, file); break; }
    }
  }
}
if (totalBytes > MAX_DATA_BYTES) warn("size", `repository is ${(totalBytes / 1048576).toFixed(1)} MB; keep supporting data under 25 MB`);
if (!exists("LICENSE")) warn("license", "LICENSE file is missing");

// ---- report -------------------------------------------------------------------------
const report = { ok: errors.length === 0, errors, warnings, summary };
if (asJson) {
  console.log(JSON.stringify(report, null, 2));
} else {
  for (const e of errors) console.log(`ERROR ${e.code}${e.path ? ` [${e.path}]` : ""}: ${e.message}`);
  for (const w of warnings) console.log(`WARN  ${w.code}${w.path ? ` [${w.path}]` : ""}: ${w.message}`);
  if (report.ok) {
    console.log(`OK    ${summary.team} — ${summary.track} — entry $${summary.entry_skill}${warnings.length ? ` (${warnings.length} warning${warnings.length === 1 ? "" : "s"})` : ""}`);
  } else {
    console.log(`FAILED with ${errors.length} error${errors.length === 1 ? "" : "s"}.`);
  }
}
process.exit(report.ok ? 0 : 1);
