# GTM Skillathon — participant template

Build a reusable agent skill that solves one go-to-market problem with real-world web data, in 2.5 hours, and submit it so the jury can run it from a single laptop.

This file is written for agents first. If you are a participant, paste the prompt in [Start here](#start-here) into your agent and let it guide you.

- Event: [Build with Codex: GTM Skillathon](https://luma.com/82q9aclg), 28 August 2026, Builders House, București
- Rules, timeline, and judging: [`RULES.md`](RULES.md) — canonical
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
- You submit a **public GitHub repository** created from this template plus a **commit SHA**. The organizer clones that exact commit, opens it in Codex, pastes your seed prompt, and presents it for you in 2 minutes.
- Submissions are GitHub issues in the submissions repository. Anything filed at or after 20:30:00 is rejected automatically.
- **Your skill stays public.** After the event, submitted skills are forked into the Formidable Builders GitHub organization (<https://github.com/formidable-oss>) and remain publicly available under the MIT licence. Do not submit anything you are not willing to publish.

## Start here

1. On GitHub, select **Use this template → Create a new repository**. Make it **public**.
2. Get it onto your laptop and open it in your agent. If you know git: `git clone <your-repo-url>`, then open the folder. If you do not: open your agent in any folder, paste your repository URL, and ask it to clone the repository and set up git for you (it needs `git`, a name and email for commits, and `gh auth login` so pushing works without passwords).
3. Paste this prompt:

```text
Read AGENTS.md, RULES.md, and .agents/skills/skillathon-guide/SKILL.md, then follow that skill: explain how the GTM Skillathon works and how I will be judged, then help me choose one track, one user, one narrow GTM job, one representative input, one success condition, and one boundary. Keep it small enough to build, test, and submit in two and a half hours.
```

4. Build your skill in `.agents/skills/<skill-name>/SKILL.md`. Test it on the representative input. Record what actually happened.
5. Fill in `submission.json`, `DEMO.md`, and everything under `demo/`.
6. Ask your agent to run `$skillathon-submit` (path: `.agents/skills/skillathon-submit/SKILL.md`). It runs the same structure and safety checks the submission system runs, commits, pushes, and files the submission. Submit early; you can resubmit until 20:30 and the latest accepted submission counts.

## What you must deliver

Everything the jury needs is inside your repository at the submitted commit:

| Artifact | Path | Purpose |
| --- | --- | --- |
| Entry skill | `.agents/skills/<skill-name>/SKILL.md` | The one skill the seed prompt invokes. Other skills may support it. |
| Seed prompt | `demo/seed-prompt.md` | The exact prompt the organizer pastes into Codex. Must invoke `$<skill-name>` and name the input path. |
| Representative input | `demo/input/<file-or-folder>` | The smallest input that shows the job. Public data only, with source URL and retrieval date. |
| Fallback output | `demo/output/<file-or-folder>` | A genuine result your skill produced during the event. Shown if the live run stalls. |
| Evaluations | `demo/evals.md` | Three cases — intended, insufficient evidence, failure/exclusion — with observed results. |
| Run sheet | `DEMO.md` | What the organizer says and shows during your 2 minutes. |
| Manifest | `submission.json` | Paths to all of the above, team, track, problem. |

No credentials are available on the jury laptop. If your skill calls an authenticated service, it must degrade gracefully and the fallback output must carry the demo.

## Organizer-provided skills

Two skills ship with this template and are ignored by judging. Do not list them in `submission.json`.

- `$skillathon-guide` — explains the event, the rules, and the judging; helps scope the job; answers questions.
- `$skillathon-submit` — validates the repository and files the submission.

## Licence

MIT. Keep `LICENSE` as is. By submitting, you agree that your repository is forked into the Formidable Builders GitHub organization and stays public there under this licence.
