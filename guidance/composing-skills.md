# Composing skills

Use multiple skills only when each one owns a distinct reusable job. One well-scoped skill is usually stronger in a three-hour event than a theatrical chain of agents.

## Define the bundle

For every skill, write down:

- **Role:** the one job it owns.
- **Input:** exact file, data shape, or prior skill output it reads.
- **Output:** exact artifact or decision it produces.
- **Boundary:** what it must refuse, exclude, or leave unresolved.
- **Handoff:** which skill or human consumes its output next.

If two skills share the same role or no one consumes a skill's output, merge or remove one.

## Choose the Demo Entry Point

Select exactly one skill that can understand the Seed Prompt and coordinate the smallest judged path. The Seed Prompt should explicitly invoke it as `$skill-name`, point to the representative input, and request an observable result.

The entry skill may call or instruct the use of other skills, but the handoff must be explicit. Do not require the presenter to remember an undocumented second prompt.

## Make results trustworthy

When the workflow makes external claims, prefer a structure such as:

```text
claim: What the workflow concluded
source: Public URL or committed evidence path
retrieved_at: Timestamp or date
confidence: High, medium, or low with a reason
```

Add behavior for missing evidence. Abstaining clearly is better than producing a polished unsupported claim.

For consequential actions—sending outreach, modifying a CRM, spending money, or publishing—stop at a reviewable draft unless the user explicitly approves execution.

## Keep skills lean

A skill needs a `SKILL.md` with `name` and `description`. Add scripts for deterministic repeated operations, references for conditional domain knowledge, and assets for reusable output materials. Do not add folders merely because the format permits them.

Use `$skill-creator` if it is installed, but keep the repository itself sufficient for participants who do not have it.
