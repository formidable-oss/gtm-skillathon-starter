# FAQ

Short answers. `RULES.md` wins on any conflict.

**What is a skill?** A folder under `.agents/skills/` with a `SKILL.md`: YAML frontmatter with `name` and `description`, then step-by-step instructions an agent follows. Codex loads it automatically and runs it when the user types `$skill-name` or when the description matches the request. See `references/skill-template.md`.

**Do I need to code?** No. A strong skill can be Markdown only. Add scripts only when a step must be deterministic and repeatable.

**Can I build with Claude Code, Cursor, or something other than Codex?** Yes. Only the judged run happens in Codex. `.agents/skills/` is Codex's location; keep your skill there so Codex finds it.

**Can I use several skills?** Yes, if each has a distinct role and the entry skill hands off explicitly. One focused skill usually scores higher than a chain. Never list `skillathon-guide` or `skillathon-submit` in `submission.json`.

**Where does the jury get my work?** From the public GitHub repository and commit SHA in your submission issue. The organizer clones that commit and opens it in the Codex desktop app.

**How do I submit?** Run `$skillathon-submit`. It validates, commits, pushes, and files an issue in the submissions repository. Or open the issue form by hand: <https://github.com/formidable-oss/gtm-skillathon-submissions/issues/new/choose>.

**Can I resubmit?** Yes, until 20:30. The latest accepted submission for your repository counts.

**What if I push after submitting?** Nothing changes. The SHA in the accepted issue is what gets judged.

**What happens at 20:30?** Submissions close. Late issues are auto-rejected. Demos begin, in random order. A team without an accepted submission does not demo.

**Who presents?** The organizer, from `DEMO.md`, in 2 minutes. You do not stand up. Make `DEMO.md` say exactly what to say and show.

**Can my skill call an API, an MCP server, or Apify?** During your build, yes. On the jury laptop there are no keys and no MCP servers, so the live run must degrade gracefully and `demo/output/` must show the real result you got during the event.

**Can I use Apify / Codex credits?** Yes; sponsors give them to approved participants. Using sponsor products is not scored.

**What counts as real-world web data?** Anything publicly fetchable: company sites, job boards, app stores, docs, pricing pages, public social posts, review sites, search results. Snapshot it into `demo/input/` with source URL and retrieval date if the live fetch is slow or flaky.

**What is not allowed as data?** Registration emails, LinkedIn exports, scraped personal profiles, anything under NDA, anything you may not redistribute. Public figures acting in their public role are fine: a CEO quoted in a press release, a founder named on an About page. Private individuals' contact details, profiles, or lists are not. Your own names in `submission.json` are fine.

**Can the live run fetch the web?** Yes. The jury laptop has internet and Codex may fetch public URLs; it has no API keys or MCP servers. If a fetch is slow or flaky, commit a snapshot in `demo/input/` with source and retrieval date and make the skill use it.

**Can my skill use scripts? In which language?** Yes: Node 24 and Python 3 exist on the jury laptop, nothing gets installed before your run, so scripts must be dependency-free. Markdown-only skills are fine and usually enough.

**Where should the live run write?** Anywhere in the repository; `demo/output/` is the convention. `demo/output/` must already contain your fallback at submission time. Check `git status` before committing so test artifacts do not get swept in.

**What do the three eval cases mean?** Intended: the normal input works. Insufficient evidence: missing or ambiguous data produces visible uncertainty or abstention, not a confident guess. Failure/exclusion/safety: the skill refuses or stops at a draft when it should. Record what actually happened.

**How is it scored?** Four automated gates (in window, valid structure, runs, clean). Five automated 1–5 scores proposed by Codex (GTM job clarity, real-world signal, evidence, skill quality, reusability). Two jury scores (presentation, vibe). Max 35. Details in `RULES.md`.

**How long should the live step take?** About 60 seconds. Anything longer belongs in the fallback output.

**Private repository?** Not allowed. The repository must be public at submission time and through the demos.

**What happens to my skill after the event?** It is forked into the Formidable Builders GitHub organization (<https://github.com/formidable-oss>) and stays public there under MIT. Submitting is consent to this. Do not include anything you are not willing to publish.

**How big can the repository be?** Keep data under 25 MB. Large files slow the clone in front of the jury.

**What if validation fails at 20:25?** Fix the reported items and resubmit. The issue timestamp must be before 20:30:00. If you cannot fix in time, resubmit the last version that passed.

**What do the verdicts mean?** `accepted`: in, this commit is judged. `rejected`: fix the listed items and resubmit. `dry-run`: filed before 18:00; the pipeline works but it is not a submission. `superseded`: a newer submission from the same repository replaced it. `late`: filed at or after 20:30:00; not accepted.
