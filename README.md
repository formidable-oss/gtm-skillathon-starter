# GTM Skillathon — participant template

Build a reusable agent skill that solves one go-to-market problem with real-world web data, in 2.5 hours, and submit it so the jury can run it from a single laptop.

This file is written for agents first. If you are a participant, paste the prompt in [Start here](#start-here) into your agent and let it guide you.

- Event: [Build with Codex: GTM Skillathon](https://luma.com/82q9aclg), 28 August 2026, Builders House, București
- Rules, timeline, and judging: [`RULES.md`](RULES.md)
- Build contract for your agent: [`AGENTS.md`](AGENTS.md)
- Submissions and live board: <https://github.com/formidable-oss/gtm-skillathon-submissions>

## How it works

| Time (Bucharest) | What happens |
| --- | --- |
| 17:00 | Doors, check-in |
| 17:30 | Intro, how the Skillathon works, live Codex workflow demo |
| 18:00 | Build starts. Submissions open. |
| **20:30** | **Hard cutoff. Submissions close.** Demos start immediately, in random order. |
| 21:45 | Formidable Builders launch party |

- Teams of 1–2 people. Build with any agent (Codex, Claude Code, Cursor, anything). The jury runs your submission in the **Codex desktop app**, so the judged path must work in Codex.
- You submit a **public GitHub repository** created from this template plus a **commit SHA**. The organizer clones that exact commit, opens it in Codex, pastes your seed prompt, and presents it for you in 2 minutes. You do not present. Your repository is the presentation.
- Submissions are GitHub issues in the submissions repository. Anything filed after 20:30 is rejected automatically. No exceptions, no extensions.

## Start here

1. On GitHub, select **Use this template → Create a new repository**. Make it **public**.
2. Clone it and open the repository root in your agent.
3. Paste this prompt:

```text
Read AGENTS.md and RULES.md. Use $skillathon-guide to explain how the GTM Skillathon works and how I will be judged, then help me choose one track, one narrow GTM job, one representative input, one success condition, and one boundary. Keep it small enough to build and test in two hours.
```

4. Build your skill in `.agents/skills/<skill-name>/SKILL.md`. Test it on the representative input. Record what actually happened.
5. Fill in `submission.json`, `DEMO.md`, and everything under `demo/`.
6. Ask your agent to run `$skillathon-submit`. It validates the repository with the same checks the submission system uses, commits, and files the submission. Submit early; you can resubmit until 20:30 and the latest accepted submission wins.

## What you must deliver

Everything the jury needs is inside your repository at the submitted commit:

| Artifact | Path | Purpose |
| --- | --- | --- |
| Entry skill | `.agents/skills/<skill-name>/SKILL.md` | The one skill the seed prompt invokes. Other skills may support it. |
| Seed prompt | `demo/seed-prompt.md` | The exact prompt the organizer pastes into Codex. Must invoke `$<skill-name>` and name the input. |
| Representative input | `demo/input/` | The smallest input that shows the job. Public data only, with source URL and retrieval date. |
| Fallback output | `demo/output/` | A genuine result your skill produced during the event. Shown if the live run stalls. |
| Evaluations | `demo/evals.md` | Three cases — intended, insufficient evidence, failure/exclusion — with observed results. |
| Run sheet | `DEMO.md` | What the organizer says and shows during your 2 minutes. |
| Manifest | `submission.json` | Paths to all of the above, team, track, problem. |

No credentials are available on the jury laptop. If your skill calls an authenticated service, it must degrade gracefully and the fallback output must carry the demo.

## Organizer-provided skills

Two skills ship with this template and are ignored by judging. Do not list them in `submission.json`.

- `$skillathon-guide` — explains the event, the rules, and the judging; helps scope the job; answers questions.
- `$skillathon-submit` — validates the repository and files the submission.

## Licence

MIT. Keep `LICENSE` as is.
