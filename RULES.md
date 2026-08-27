# Rules and judging

Canonical source for how the GTM Skillathon runs and how submissions are scored. The jury tooling reads this file. If another document disagrees with it, this file wins.

## Timeline — 28 August 2026, Europe/Bucharest (UTC+3)

| Local | UTC | Event |
| --- | --- | --- |
| 17:00 | 14:00 | Doors, check-in |
| 17:30 | 14:30 | Intro, rules, live Codex workflow demo |
| 18:00 | 15:00 | Build starts. Submissions open. |
| 20:30 | 17:30 | Submissions close. Demos start. |
| 21:45 | 18:45 | Launch party |

## Participation

- Teams of one or two people. One repository per team; resubmit from it as often as you like. If you must switch repositories, tell an organizer — only one repository per team is judged.
- Build with any agent or tool. The judged path runs in the Codex desktop app on the organizer laptop.
- Tracks: `ai-search-optimization`, `personalized-growth-engines`, `churn-detection`, `synthetic-buyer-simulations`, `plg-automation`, `multi-agent-orchestration`, `custom`. Pick one. `custom` is any other real GTM problem.
- Sponsors (OpenAI/Codex, Apify) offer credits and prizes. Using their products is welcome, not required, and not scored.

## Submission

- A submission is a GitHub issue in <https://github.com/formidable-oss/gtm-skillathon-submissions> naming a **public** repository and a **commit SHA**. `$skillathon-submit` files it for you.
- The issue timestamp is the submission time. Issues opened before 18:00 are treated as dry runs. Issues opened at or after 20:30:00 local time are rejected automatically. There is no grace period and no manual acceptance of late work.
- A team may resubmit any number of times before the cutoff. The latest accepted submission for the same repository replaces earlier ones.
- The organizer clones the recorded SHA. Commits pushed after submission are not judged.
- A team with no accepted submission at 20:30 does not demo and is not ranked.

## Demo

- The organizer presents every team, in an order drawn at random after the cutoff, from one laptop.
- Per team: 2 minutes target, 2 minutes 30 seconds hard stop.
- The organizer opens your repository in Codex, pastes `demo/seed-prompt.md`, shows what `DEMO.md` says to show, and falls back to `demo/output/` if the live run exceeds about 60 seconds or fails.
- The jury laptop has internet access, Codex, git, Node 24, and Python 3. Codex may fetch public URLs during the live run. It has no API keys, no MCP servers, no logged-in services other than Codex, and nothing gets installed before your run: scripts must work with what is there.
- The live run may write anywhere in the repository; `demo/output/` must already contain the fallback at submission time.

## Hard rules

Breaking any of these disqualifies the submission.

1. No secrets in the repository or its history.
2. No personal data: no registration emails, LinkedIn exports, scraped profiles, or consent data without documented permission.
3. No fabricated evidence. Eval results, fallback output, sources, and retrieval dates must be genuine.
4. Only data you may redistribute. Public snapshots carry a source URL and retrieval date.
5. The repository is public at submission time and stays public through the demos.
6. Submitted skills are forked into the Formidable Builders GitHub organization (<https://github.com/formidable-oss>) and remain public there under MIT after the event. Submitting is consent to this; do not submit anything you are not willing to publish.

## Judging

### Automated gates

Checked by the organizer tooling from the submitted commit. Fail any gate and the team is listed but not ranked.

| Gate | Check |
| --- | --- |
| Submitted in window | Accepted issue before 20:30, public repo, SHA exists |
| Valid structure | `submission.json` parses; every declared path resolves and is committed; one entry skill, listed in `skills`, with valid frontmatter; seed prompt invokes it as `$<skill-name>` and names the input path; evals have three cases with pass/fail cells; no template placeholders left. Exactly what `$skillathon-submit` checks |
| Runs | The seed prompt completes in Codex from a fresh clone within 75 seconds (the organizer switches to the fallback at about 60 seconds on stage) and produces what `DEMO.md` promises. A timeout with a genuine fallback output is a pass with a warning |
| Clean | No secrets, no personal data, no credentials needed to run |
| Honest | No text addressed to the judge, jury, or scoring model, no hidden content, and no evidence that contradicts the repository. The organizer decides on the scanner's and Codex's findings |

### Automated scores

Proposed by Codex from the repository, 1–5 each with a one-line rationale. The jury may override any score.

| Criterion | 5 looks like |
| --- | --- |
| GTM job clarity | One named user, one real problem, one narrow job, one explicit boundary, all stated in `DEMO.md` |
| Real-world signal | The output is grounded in live or genuinely sourced web data with source URL and retrieval date; cached data is never described as live |
| Evidence | Three distinguishable eval cases with observed results, honest pass/fail judgments, and evidence paths that support them |
| Skill quality | Imperative steps; explicit inputs, outputs, failure behavior, and completion criteria; a description that says when to trigger; no dead or duplicate skills |
| Reusability | The skill works on another input of the same kind without editing; limitations are stated |

### Jury scores

Each jury member scores 1–5 during the demo; the criterion score is the jury average, to one decimal.

| Criterion | What it rewards |
| --- | --- |
| Presentation | The 2 minutes land: problem, live capability, result, limitation |
| Vibe | The jury's overall impression of the team and the idea |

### Final score

Sum of the five automated scores and the two jury scores, out of 35. Gated teams are excluded. Ties are settled by jury discussion.

### Prizes

1st: $2,000 in credits and 3 months ChatGPT Pro. 2nd: $500 OpenAI credits and 3 months ChatGPT Pro. 3rd: $250 OpenAI credits and 3 months ChatGPT Pro. Every approved participant receives up to $100 Codex, $50 OpenAI, and $100 Apify credits.
