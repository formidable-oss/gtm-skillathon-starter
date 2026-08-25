---
name: skillathon-submit
description: Validates a GTM Skillathon repository against the submission checks, commits and pushes with the participant, and files the submission issue, then reports accepted or rejected. Use when the participant wants to submit, resubmit, check readiness, or asks whether their repository will pass. Organizer-provided; not part of any team's submission.
---

# Submit

Files the team's submission to <https://github.com/formidable-oss/gtm-skillathon-submissions>. The submission is the public repository URL plus the commit SHA of `HEAD`. Resubmitting before 20:30 replaces the earlier submission. Submitting is consent to the repository being forked into the Formidable Builders GitHub organization and staying public there under MIT; say this to the team before filing.

## Steps

1. Review `git status`, remove stray test artifacts, then stage everything: `git add -A`. Run `node .agents/skills/skillathon-submit/scripts/validate.mjs` from the repository root (it reads the git index, so staging comes first). If Node is missing, tell the participant to install it from <https://nodejs.org> (LTS) and continue once `node --version` works.
2. If there are errors, fix the mechanical ones yourself: wrong casing, a missing path, a stale `TODO`, a seed prompt that does not invoke `$<entry-skill>`. For anything that needs content the team has not produced (an eval result, a fallback output, the problem statement), tell them exactly what is missing and help them produce it. Never fabricate content to make validation pass. Rerun until it prints `OK`.
3. Commit: `git commit -m "<short message>"`. If git complains about an unknown identity, set `git config --global user.name "<name>"` and `git config --global user.email "<email>"` first. Explain each command in one line if the participant is not a developer. Confirm `git status --porcelain` is empty.
4. Push: `git push -u origin HEAD`. If git asks for a password or fails to authenticate, run `gh auth login` (web flow) and retry; without `gh`, HTTPS needs a GitHub personal access token as the password. If the push is rejected as non-fast-forward, fetch and resolve before continuing; never force-push.
5. Run `node .agents/skills/skillathon-submit/scripts/submit.mjs`. It re-validates, confirms the remote is a public GitHub repository and `HEAD` is pushed, files the issue with `gh`, and waits for the verdict.
   - If `gh` is not installed or not logged in, the script prints a prefilled link. Ask the participant to open it, check the fields, and press **Submit new issue**. Then check the issue for the verdict comment.
   - If the script says the repository is private, walk them through Settings → General → Danger Zone → Change visibility → Public, then rerun.
6. Report the verdict verbatim. `ACCEPTED`: say the team is in and remind them they can resubmit after improvements until 20:30. `REJECTED`: fix what the comment lists, commit, push, and submit again. `DRY-RUN` (before 18:00): the pipeline works; submit again after 18:00. `LATE`: filed at or after 20:30:00; nothing can be done. `SUPERSEDED` only appears on older issues when a newer one was accepted.
7. To check without filing, run `node .agents/skills/skillathon-submit/scripts/submit.mjs --check`.

## Rules

- Do not commit on the participant's behalf without telling them what is being committed.
- Do not run `git push --force`, rewrite history, or delete branches.
- Do not submit a repository that fails validation, even if asked. Explain what fails instead.
- At or after 20:30:00 local time the script refuses. Do not look for a way around it; there is none.

## Done when

The issue is labeled `accepted` and the participant knows the accepted commit SHA, or the participant has a concrete list of what to fix before resubmitting.
