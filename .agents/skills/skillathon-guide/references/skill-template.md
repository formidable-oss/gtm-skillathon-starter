# Skill template

Copy to `.agents/skills/<skill-name>/SKILL.md`. Folder name and `name` must match and be lowercase hyphen-case. Frontmatter contains only `name` and `description`.

```markdown
---
name: account-signal-brief
description: Produces a one-page pre-call brief for a B2B account from its public website, recent news, and job posts, with sources and confidence. Use when the user names a company and asks for a brief, signals, or talking points before outreach or a call.
---

# Account signal brief

## Input

A company name or website URL, given in the prompt or in a file the prompt names. If neither is present, ask for one and stop.

## Steps

1. Resolve the company website. If it cannot be resolved, report "insufficient evidence: company not found" and stop.
2. Fetch the homepage, the pricing or product page, the careers page, and the two most recent news or blog items. Record each URL and the retrieval date.
3. Extract up to five signals, each as `claim / source URL / retrieved date / confidence (high, medium, low) and why`.
4. Write `demo/output/<company-slug>-brief.md` (or the path the prompt names) with: company one-liner, the signal table, three suggested talking points, and a "What I could not verify" section.
5. Print the path and the signal table.

## Rules

- Never send or draft outreach to a person. Talking points only.
- Never include personal data about individuals; name roles, not people.
- If fewer than two signals have high or medium confidence, say the brief is thin and why.
- Never describe cached or committed data as live.

## Done when

The brief file exists, every claim has a source and date, and the "could not verify" section is filled or explicitly empty.
```

Keep the whole file under about 80 lines. Frontmatter is `key: value` lines; a multi-line `description: >` block is accepted but keep it short. Add `scripts/` or `references/` only for something a step genuinely needs.
