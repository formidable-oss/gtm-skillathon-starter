# Check submission

Run the prompt below in Codex from the repository root after committing the candidate submission content. This is the official readiness check. It checks portability and completeness, not whether the business idea deserves to win.

## Readiness Prompt

```text
Audit this GTM Skillathon repository for submission readiness. Read and follow AGENTS.md first, then README.md, DEMO.md, submission.json, and every submitted SKILL.md.

Your job is to audit, make only safe mechanical fixes, re-audit, and write READINESS.md. Do not materially redesign the Skill Bundle. Do not fabricate or infer a successful eval, Prior Output, source, public access check, credential setup, or Fresh-Clone Smoke Test.

Safety rules:
- Never reveal secret values in chat, terminal output, diffs, or READINESS.md. Report only file path, line number, credential type, and remediation.
- Never commit, push, publish, invite collaborators, change repository visibility, or delete participant artifacts.
- You may fix exact-casing path mistakes, broken internal links, stale cross-references, and obvious formatting errors when intent is unambiguous.
- Ask before any fix that changes behavior, evaluation meaning, output content, licensing, data, or the team's stated problem.
- If you change any file other than READINESS.md, the candidate commit is no longer the tested commit. Re-audit the working tree, report NOT READY, and tell the participant to review and commit those fixes, repeat the Fresh-Clone Smoke Test, and run this prompt again.

Audit the following:

1. Candidate state
- Record `git rev-parse HEAD` as the audited candidate SHA.
- Confirm there are no uncommitted participant changes before the audit. READINESS.md may be replaced during this run.
- Parse submission.json as JSON and require schema_version 1 and demo_agent "codex".
- Treat TODO, REPLACE, `your-skill-name`, placeholder-only README files, and unresolved template paths in required artifacts as hard failures.

2. Manifest and paths
- Require non-empty team display name, member display names, primary_track, problem, and skill roles.
- Resolve every repository-relative path in submission.json with exact casing.
- Require a committed representative input, genuine Prior Output, eval cases, eval results, Seed Prompt, DEMO.md, and LICENSE.
- Confirm submission.json license matches LICENSE.
- Confirm required public URLs are accessible without participant authentication.

3. Codex Skill Bundle
- Inspect every `.agents/skills/*/SKILL.md` referenced by submission.json.
- Require YAML frontmatter with only non-empty `name` and `description` fields.
- Require lowercase hyphen-case skill and folder names that match.
- Require exactly one demo_entry_point, and require that it points to a submitted skill.
- Require demo/seed-prompt.md to contain one directly copyable prompt that explicitly mentions the entry skill as `$<skill-name>` and names the representative input.
- Confirm each skill has one distinct role and that multi-skill inputs, outputs, and handoffs are understandable.
- Warn, but do not fail solely, when there are more than three skills or when a skill appears unused, duplicative, or confusingly connected.

4. Demo Pack and data
- Confirm DEMO.md points to the same entry skill, Seed Prompt, input, Prior Output, and eval evidence as submission.json.
- Confirm DEMO.md states one meaningful capability that should be visible in about 60 seconds and has a usable Prior Output fallback.
- Require source URL and retrieval date for committed public snapshots.
- Fail on personal data without documented permission or material that is clearly non-redistributable.
- Warn when supporting data exceeds 25 MB.
- Ensure cached or Prior Output is not described as newly retrieved live data.

5. Evaluations
- Require three distinguishable cases: intended; edge or insufficient evidence; and failure, exclusion, or safety.
- For each case require an input or input path, expected behavior or invariant, observed result, pass/fail judgment, and evidence path.
- Check that evidence exists and supports the recorded judgment. Do not reroute a failing result into a pass.
- Warn when there is no baseline-without-skills comparison.

6. Credentials and repository safety
- Inspect tracked files and Git history reachable from the candidate commit for likely secrets, tokens, private keys, passwords, credential-bearing URLs, and accidentally committed .env files. Use redacted output only.
- Treat a likely tracked secret as a hard failure even if later deleted from the working tree; recommend rotation and history cleanup without performing either.
- If credentials are required, require variable names in `.env.example` and submission.json, exact setup instructions, a Prior Output fallback, and no values in Git.
- Warn that the judged path is credentialed.
- If the GitHub repository is private, verify that every organizer and jury handle announced for the event has accepted access. A pending invitation or unverifiable access is a hard failure.

7. Fresh-Clone Smoke Test
- Run this section only after the static audit has found a real entry skill, resolved required paths, and no placeholder hard failures. Otherwise record the smoke test as skipped because of those blockers; do not waste the demo window invoking an incomplete template.
- Create a temporary clone or worktree of the exact audited candidate SHA in a new directory. Do not rely on untracked files from the participant workspace.
- Follow only committed setup instructions.
- Use a separate Codex session rooted at that clean checkout and run the exact contents of demo/seed-prompt.md. You may use a nested non-interactive Codex invocation only when it already works safely in the current environment.
- Do not copy, symlink, expose, or reconfigure authentication material to make nested Codex execution work. If nested startup is blocked, pause and ask the participant to run the prompt in a separate Codex session; a nested startup failure is an environment limitation, not evidence that the Skill Bundle failed.
- Confirm Codex discovers and invokes the declared Demo Entry Point, reads the representative input, and visibly completes the meaningful capability promised by DEMO.md.
- Stop a live attempt after 75 seconds. Record the timeout and use the Prior Output fallback; do not let readiness consume the presentation-preparation window.
- Record environment, exact candidate SHA, invocation method, duration, produced artifact or observed result, and limitations.
- Remove the temporary checkout after recording evidence. Never remove the participant workspace.
- A test in another agent, a test from the dirty source workspace, a claimed prior run without inspectable evidence, or merely opening the Prior Output does not pass this check.

Hard failures:
- No Codex-discoverable Demo Entry Point.
- Missing or placeholder Seed Prompt, representative input, Prior Output, eval cases, or eval results.
- Broken required paths or inaccessible required public resources.
- Likely secrets in tracked files or reachable Git history.
- No successful Fresh-Clone Smoke Test of the audited candidate SHA in Codex.
- A private repository has not been shared with all announced organizer and jury accounts.
- Any non-READINESS.md file changed during this audit.

Warnings:
- More than three skills.
- More than 25 MB of supporting data.
- Credentialed judged path.
- No baseline-without-skills comparison.
- Planned live capability takes more than about 60 seconds.
- Unused, duplicative, or confusingly connected skills.

Write READINESS.md with:
- status: READY or NOT READY
- audited candidate SHA, UTC timestamp, and Codex invocation/environment
- concise table of checks with PASS, FAIL, or WARN and evidence paths
- safe mechanical fixes made
- hard failures
- warnings
- Fresh-Clone Smoke Test evidence
- limitations and manual setup
- exact next actions

Set READY only when there are zero hard failures and no file other than READINESS.md changed during this run. End by reminding the participant to review READINESS.md and commit it as the only change. The final submission commit must have the audited candidate SHA as its direct parent and must change only READINESS.md. Any later material change invalidates the report.
```
