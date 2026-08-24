#!/usr/bin/env node
// Files a GTM Skillathon submission for the repository in the current directory.
//
// Usage: node submit.mjs [--check] [--no-wait]
//   --check    validate and print what would be submitted; do not file an issue
//   --no-wait  file the issue and exit without waiting for the verdict
//
// Refuses when validation fails, the working tree is dirty, HEAD is not pushed, the remote
// is not a public GitHub repository, or the cutoff has passed. Never commits or pushes;
// the agent does that explicitly with the participant.

import { execFileSync, spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SUBMISSIONS_REPO = "formidable-oss/gtm-skillathon-submissions";
// Fallback window; the live window comes from the submission system's board.json,
// which organizers can adjust during the event. The server check is authoritative either way.
let OPEN_AT = Date.parse("2026-08-28T15:00:00Z"); // 18:00 Europe/Bucharest
let CLOSE_AT = Date.parse("2026-08-28T17:30:00Z"); // 20:30 Europe/Bucharest
try {
  const res = await fetch(`https://raw.githubusercontent.com/${SUBMISSIONS_REPO}/main/board.json?t=${Date.now()}`, { signal: AbortSignal.timeout(4000) });
  if (res.ok) {
    const board = await res.json();
    if (board.open_at) OPEN_AT = Date.parse(board.open_at);
    if (board.close_at) CLOSE_AT = Date.parse(board.close_at);
  }
} catch { /* offline: keep fallbacks; the server still decides */ }
const HERE = dirname(fileURLToPath(import.meta.url));

const flags = new Set(process.argv.slice(2));
const dryRun = flags.has("--check") || flags.has("--dry-run");
const wait = !flags.has("--no-wait");

const sh = (cmd, args, opts = {}) => {
  const r = spawnSync(cmd, args, { encoding: "utf8", ...opts });
  return { ok: r.status === 0, out: (r.stdout ?? "").trim(), err: (r.stderr ?? "").trim() };
};
const fail = (msg) => { console.error(`STOP: ${msg}`); process.exit(1); };

// 1. Time window
const now = Date.now();
if (now >= CLOSE_AT) fail("submissions closed at 20:30 local time. Late submissions are not accepted.");
const early = now < OPEN_AT;

// 2. Validate
const v = sh("node", [join(HERE, "validate.mjs"), ".", "--json"]);
let report;
try { report = JSON.parse(v.out); } catch { fail(`validator did not run: ${v.err || v.out}`); }
for (const e of report.errors) console.log(`ERROR ${e.code}${e.path ? ` [${e.path}]` : ""}: ${e.message}`);
for (const w of report.warnings) console.log(`WARN  ${w.code}${w.path ? ` [${w.path}]` : ""}: ${w.message}`);
if (!report.ok) fail("fix the errors above, commit, then run again.");
const { team, members, track, entry_skill } = report.summary;

// 3. Git state
if (!sh("git", ["rev-parse", "--is-inside-work-tree"]).ok) fail("not a git repository.");
if (sh("git", ["status", "--porcelain"]).out) fail("working tree has uncommitted changes. Commit everything first (git add -A && git commit), then run again.");
const sha = sh("git", ["rev-parse", "HEAD"]).out;
const remoteUrl = sh("git", ["remote", "get-url", "origin"]).out;
const m = /github\.com[:/]([^/]+)\/(.+?)(?:\.git)?\/?$/.exec(remoteUrl);
if (!m) fail(`origin is not a GitHub repository (${remoteUrl || "no origin"}).`);
const repo = `${m[1]}/${m[2]}`;
const repoUrl = `https://github.com/${repo}`;

const upstream = sh("git", ["rev-parse", "--abbrev-ref", "@{upstream}"]);
if (!upstream.ok) fail("current branch has no upstream. Push it first (git push -u origin HEAD), then run again.");
sh("git", ["fetch", "origin"]);
const remoteSha = sh("git", ["rev-parse", upstream.out]).out;
if (remoteSha !== sha) fail(`HEAD (${sha.slice(0, 7)}) is not pushed to ${upstream.out}. Run git push, then run again.`);

// 4. Public repository check (gh if available, else unauthenticated API)
const gh = sh("gh", ["--version"]).ok && sh("gh", ["auth", "status"]).ok;
let isPublic = null;
if (gh) {
  const r = sh("gh", ["api", `repos/${repo}`, "--jq", ".private"]);
  if (r.ok) isPublic = r.out === "false";
}
if (isPublic === null) {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, { headers: { "User-Agent": "gtm-skillathon" } });
    isPublic = res.status === 200 && (await res.json()).private === false;
  } catch { isPublic = null; }
}
if (isPublic === false) fail(`${repoUrl} is private. Make it public (Settings → Danger Zone → Change visibility), then run again.`);
if (isPublic === null) console.log("WARN  could not verify repository visibility; the submission system will.");

// 5. Compose the submission
const title = `Submission: ${team}`;
const body = [
  "### Team name", "", team, "",
  "### Members", "", members.join(", "), "",
  "### Track", "", track, "",
  "### Repository URL", "", repoUrl, "",
  "### Commit SHA", "", sha, "",
].join("\n");

console.log("");
console.log(`Team        ${team} (${members.join(", ")})`);
console.log(`Track       ${track}`);
console.log(`Entry skill $${entry_skill}`);
console.log(`Repository  ${repoUrl}`);
console.log(`Commit      ${sha}`);
if (early) console.log("NOTE        before 18:00 local time: this will be recorded as a dry run, not a submission.");
if (dryRun) { console.log("\nCheck only: no issue filed."); process.exit(0); }

// 6. File it
const formUrl = `https://github.com/${SUBMISSIONS_REPO}/issues/new?template=submission.yml` +
  `&title=${encodeURIComponent(title)}&team=${encodeURIComponent(team)}&members=${encodeURIComponent(members.join(", "))}` +
  `&track=${encodeURIComponent(track)}&repo=${encodeURIComponent(repoUrl)}&sha=${encodeURIComponent(sha)}`;

if (!gh) {
  console.log("\ngh CLI is not available or not logged in. Open this link, check the fields, and press Submit new issue:\n");
  console.log(formUrl);
  console.log("\nThen watch the issue: the submission system comments with accepted or rejected within about two minutes.");
  process.exit(0);
}

const created = sh("gh", ["issue", "create", "-R", SUBMISSIONS_REPO, "--title", title, "--body", body]);
if (!created.ok) {
  console.log(`\ngh could not create the issue (${created.err}). Open this link instead:\n\n${formUrl}`);
  process.exit(1);
}
const issueUrl = created.out.split("\n").pop();
const issueNumber = issueUrl.split("/").pop();
console.log(`\nFiled ${issueUrl}`);
if (!wait) process.exit(0);

// 7. Wait for the verdict
process.stdout.write("Waiting for the submission system");
const deadline = Date.now() + 4 * 60 * 1000;
while (Date.now() < deadline) {
  await new Promise((r) => setTimeout(r, 10000));
  process.stdout.write(".");
  const r = sh("gh", ["issue", "view", issueNumber, "-R", SUBMISSIONS_REPO, "--json", "labels,comments"]);
  if (!r.ok) continue;
  const data = JSON.parse(r.out);
  const labels = data.labels.map((l) => l.name);
  const verdict = ["accepted", "rejected", "dry-run", "late", "superseded"].find((l) => labels.includes(l));
  if (!verdict) continue;
  const comment = (data.comments.at(-1)?.body ?? "").replace(/<!-- skillathon-record[\s\S]*?-->/g, "").trim();
  console.log(`\n\n${verdict.toUpperCase()}\n\n${comment}`);
  process.exit(verdict === "accepted" || verdict === "dry-run" ? 0 : 1);
}
console.log(`\n\nNo verdict yet. Check ${issueUrl} in a minute; the system comments there.`);
