# GTM Skillathon build contract

Help the team produce the smallest reusable GTM Skill Bundle that can be evaluated and demonstrated in Codex within the event constraints.

## Fixed contract

- The build window is about three hours and the jury demo is three minutes.
- The team may use any Build Agent, but the judged path must work in Codex.
- The bundle may contain multiple skills, but it must expose exactly one Demo Entry Point and one Seed Prompt.
- The Seed Prompt must explicitly invoke the Demo Entry Point and identify the representative input.
- One meaningful capability should execute visibly in about 60 seconds.
- A genuine Prior Output must make the demo recoverable if a live dependency fails.
- Secrets must stay outside Git. Required environment variable names belong in `.env.example` and `submission.json`.
- Everything else required by the judged path must be committed or available at a public URL.

## Working method

1. Read `README.md`, `DEMO.md`, and `submission.json` before proposing changes.
2. Help the team choose one primary track, one narrow GTM job, one representative input, one success condition, and one explicit boundary.
3. Prefer one focused skill. Add another only when it has a distinct role and a clear input/output handoff.
4. Put each skill at `.agents/skills/<skill-name>/SKILL.md`. Use lowercase hyphen-case folder names.
5. Give every `SKILL.md` YAML frontmatter with only `name` and `description`. Make the description state what the skill does and when it should trigger.
6. Write imperative steps with explicit inputs, outputs, evidence expectations, failure behavior, and completion criteria.
7. Use `guidance/` only when relevant; do not duplicate it into skills.
8. Test the intended, insufficient-evidence, and failure/exclusion cases. Record observed evidence rather than polishing hypothetical results.
9. Keep `DEMO.md` and `submission.json` as pointers to canonical artifacts, not duplicate copies.
10. Run the exact readiness workflow in `CHECK_SUBMISSION.md` only after the candidate submission content is committed.

## Boundaries

- Do not broaden the product or add infrastructure that the three-minute judged path does not need.
- Do not invent facts, sources, evaluations, results, successful commands, or smoke-test evidence.
- Do not silently weaken a boundary to make an eval pass.
- Do not expose secret values in terminal output or reports.
- Do not commit private, personal, or non-redistributable data.
- Ask before making a material product choice that the team has not decided.

## Completion

The repository is complete only when:

- `submission.json` has no placeholders and every path resolves with exact casing.
- Codex discovers the declared Demo Entry Point and the exact Seed Prompt invokes it.
- The representative input, Prior Output, three eval cases, and observed results are committed.
- `DEMO.md` supports the entire three-minute presentation without repository searching.
- The exact candidate commit passes a Fresh-Clone Smoke Test in Codex.
- `READINESS.md` reports `READY` with no hard failures.
