# Add your skills here

Create one folder per skill:

```text
.agents/skills/
└── your-skill-name/
    └── SKILL.md
```

Use lowercase hyphen-case for both the folder and skill name. A minimal skill begins:

```markdown
---
name: your-skill-name
description: State what this skill does and the specific tasks that should trigger it.
---

# Your skill

1. Read the declared input.
2. Perform the focused workflow.
3. Write the declared output with evidence and limitations.
```

The frontmatter must contain only `name` and `description`. Keep the workflow focused. Add `scripts/`, `references/`, `assets/`, or `agents/openai.yaml` only when the skill genuinely needs them.

Delete this README after adding the team's skills.
