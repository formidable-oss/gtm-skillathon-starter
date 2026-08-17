# GTM Skillathon Starter

Build a reusable GTM agent Skill Bundle in about three hours, prove that it works, and make it easy to present from a fresh laptop in three minutes.

This is the participant template for the [Build with Codex: GTM Skillathon](https://luma.com/82q9aclg). Use any agentic tool while building; the judged path must run in Codex.

## Start here

1. Select **Use this template** on GitHub and create a new repository. Public is simplest; private is allowed if you share it with the announced organizer and jury accounts.
2. Clone your repository and open its root in Codex.
3. Ask Codex: `Read AGENTS.md, then help us define the smallest demonstrable GTM job for our primary track.`
4. Build one to three focused skills in `.agents/skills/`. You may build more, but explain why each one is needed.
5. Replace every `TODO` and placeholder in the required submission files.
6. Run the prompt in `CHECK_SUBMISSION.md`, resolve every hard failure, and commit the resulting `READINESS.md`.

Codex discovers repository skills from `.agents/skills`, and explicit `$skill-name` invocation is supported in Codex. See the [official OpenAI skill documentation](https://learn.chatgpt.com/codex/build-skills).

## Required deliverables

- Exactly one Codex Demo Entry Point at `.agents/skills/<skill-name>/SKILL.md`.
- Exactly one copyable Seed Prompt in `demo/seed-prompt.md`.
- A representative input in `demo/input/`.
- A genuine result produced during the event in `demo/prior-output/`.
- Three evaluation cases and their observed results in `demo/evals/`.
- A completed `DEMO.md` and valid `submission.json`.
- A successful Fresh-Clone Smoke Test recorded in `READINESS.md`.

Multiple skills may cooperate, but the Seed Prompt must start through one declared Demo Entry Point.

## Suggested three-hour pace

| Time | Target |
| --- | --- |
| 0:00–0:20 | Choose one primary track, one narrow GTM job, one success condition, and one boundary. |
| 0:20–1:30 | Build the smallest useful Skill Bundle and one representative input-to-output path. |
| 1:30–2:10 | Run the intended, edge, and failure cases; refine the skills and record evidence. |
| 2:10–2:35 | Produce the Prior Output and complete the demo control files. |
| 2:35–2:50 | Test the exact Seed Prompt from a fresh clone in Codex. |
| 2:50–3:00 | Run readiness, resolve failures, freeze the commit, and rehearse. |

Shrink scope before sacrificing evaluation, portability, or the fallback result.

## Non-negotiable rules

- Never commit secrets. Document variable names in `.env.example`; configure values outside Git.
- Commit only data you may redistribute. Add source URLs and retrieval dates for public snapshots.
- Do not include registration emails, LinkedIn profiles, consent data, or personal data without permission.
- Do not fabricate evals, sources, smoke tests, or Prior Output.
- A required URL must be publicly accessible without your account.
- Aim to keep supporting data below 25 MB.
- Confirm the MIT license in this template or replace `LICENSE` and update `submission.json` with your explicit choice.

Credentialed capabilities are allowed, but must be configured on the organizer laptop at least 30 minutes before demos and must have a committed fallback result.

## Finish and submit

1. Commit all candidate content except the newly generated `READINESS.md`.
2. Test that candidate commit from a genuinely fresh clone in Codex using only committed setup instructions.
3. Run the complete prompt in `CHECK_SUBMISSION.md` from the candidate repository.
4. Resolve hard failures and repeat the fresh-clone test when a material file changes.
5. Commit only the generated `READINESS.md`. This report-only commit is the final submission commit.
6. Submit the repository URL and exact final commit SHA through the channel announced at the event.
7. Freeze the SHA 10 minutes before presentations. Later changes require another smoke test and readiness run.

For a private repository, verify organizer and jury access before submitting. A pending invitation is not verified access.

## Three-minute demo

Open `DEMO.md` on the shared laptop. It is the complete presentation control surface:

- 25 seconds: problem and user.
- 20 seconds: skill contract and representative input.
- 60 seconds: paste the Seed Prompt and show one meaningful capability in Codex.
- 45 seconds: show the result and relevant evidence.
- 20 seconds: summarize the three eval cases.
- 10 seconds: reusable value and material limitation.

If a live dependency stalls, switch immediately to the committed Prior Output and say when and how it was produced.

## Optional guidance

Read only what helps your current step:

- [Writing for agents](guidance/writing-for-agents.md)
- [Composing skills](guidance/composing-skills.md)
- [Demo and evals](guidance/demo-and-evals.md)

Installed skills such as `$skill-creator` or `$writing-for-agents` can help, but this repository does not depend on them.
