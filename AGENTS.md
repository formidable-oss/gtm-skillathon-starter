# Build contract

You are helping a team of one or two people win the GTM Skillathon. Read `RULES.md` for the timeline, rules, and judging. Your job is the smallest skill that does one real go-to-market job with real-world web data, provably, and survives being run by a stranger from a fresh clone in Codex.

## Non-negotiables

- Submissions close at 20:30 local time. Plan the work backwards from 20:15. Submit something that passes validation by 19:45, then improve and resubmit.
- The judged path runs in the Codex desktop app on a laptop with no API keys, no MCP servers, no logged-in services. Everything the seed prompt needs is committed or at a public URL.
- One entry skill at `.agents/skills/<skill-name>/SKILL.md`. Other skills are allowed only with a distinct role and an explicit handoff. Never list `skillathon-guide` or `skillathon-submit` in `submission.json`.
- Never invent facts, sources, eval results, fallback output, or retrieval dates. Record what happened, including failures.
- Never commit secrets, personal data, or data you may not redistribute. See hard rules in `RULES.md`.

## Method

1. Scope with `$skillathon-guide` (`.agents/skills/skillathon-guide/SKILL.md`): one track, one user, one narrow job, one representative input, one success condition, one boundary. Write the sentence "Given `<input>`, `$<skill>` produces `<artifact>` with `<evidence>` while never `<boundary>`." If it needs "and", cut scope.
2. Write `SKILL.md` with YAML frontmatter containing only `name` and `description`. The description states what the skill does and when it triggers. The body is imperative steps: validate input, do the job, write the output with sources and limitations, what to do when evidence is missing, what to refuse, when it is done.
3. Put the representative input in `demo/input/`. If it is a public snapshot, add its source URL and retrieval date next to it.
4. Write `demo/seed-prompt.md`: one prompt, invoking `$<skill-name>`, naming the input path, asking for the observable result. This is what the organizer pastes. It must work cold.
5. Run the seed prompt. Save the genuine result to `demo/output/`. Note when and how it was produced. This is the fallback if the live run stalls.
6. Run the three eval cases and record observed results in `demo/evals.md`: intended; insufficient evidence; failure, exclusion, or safety. A failing case is recorded as failing. Do not weaken an expectation after the run.
7. Fill `DEMO.md` for the organizer who will present without you: what to say, what to watch for, where the fallback is, what the limitation is.
8. Fill `submission.json`. Review `git status` so test artifacts do not get committed by accident. Then run `$skillathon-submit` (`.agents/skills/skillathon-submit/SKILL.md`). Fix what it reports. Resubmit after every material improvement.

## Time budget for a 2.5-hour build

| Until | Done |
| --- | --- |
| 18:20 | Scope sentence written. Input chosen. |
| 19:15 | Skill works once on the representative input. |
| 19:45 | Evals run, output saved, `DEMO.md` and `submission.json` filled, first submission accepted. |
| 20:15 | Improvements in. Final resubmission. |
| 20:30 | Cutoff. |

Shrink scope before skipping evals, the fallback output, or the submission.

## What a good skill looks like

- Triggers on a clear request, reads a declared input, and produces a declared artifact.
- Cites sources with URLs and retrieval dates. Marks confidence. Says "insufficient evidence" instead of guessing.
- Stops at a reviewable draft before any consequential action: sending, publishing, modifying a CRM, spending money.
- Works on a second input of the same kind without editing.
- Finishes the live path in about 60 seconds. Long or flaky steps belong in the fallback output, described honestly.

## Boundaries for you, the agent

- Do not add infrastructure, frameworks, or runners the 2-minute judged path does not need.
- Do not make material product choices the team has not made. Ask, briefly.
- Do not report a step as done unless you verified it. Show the evidence path.
- Do not print secret values, even when diagnosing.
