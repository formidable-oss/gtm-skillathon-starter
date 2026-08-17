# Writing for agents

Use this when Codex follows your instructions inconsistently or spends time rediscovering the intended workflow.

## Keep one source of truth

Put each fact in one canonical place and link to it elsewhere:

- Build contract: `AGENTS.md`
- Presentation contract: `DEMO.md`
- Exact invocation: `demo/seed-prompt.md`
- Skill behavior: its `SKILL.md`
- Artifact paths: `submission.json`
- Eval detail: `demo/evals/`

Duplicated instructions drift. Replace copies with short pointers.

## Write executable instructions

Prefer ordered, imperative steps:

1. Name the input and how to validate it.
2. State the transformation or decision.
3. Define the output path and shape.
4. Require evidence, provenance, or uncertainty where it matters.
5. State when to abstain, stop, or ask for approval.
6. Define completion in observable terms.

Replace “analyze thoroughly” with the exact checks and artifact the agent must produce.

## Use progressive disclosure

Keep the common path in `SKILL.md`. Move details into a directly linked resource only when they are conditional or lengthy. Do not make the agent follow a chain of references to find a core requirement.

## Edit ruthlessly

Remove:

- Background the agent already knows.
- Steps that do not affect the result.
- Multiple labels for the same concept.
- Advice that cannot be checked.
- Examples that look like required data.

After editing, ask another agent to follow only the repository instructions. Any necessary explanation you give outside the repository is missing documentation.
