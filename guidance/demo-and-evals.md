# Demo and evals

Design the demonstration and evaluations while building, not after the capability is finished.

## Pick one observable promise

Complete this sentence:

> Given **this representative input**, `$entry-skill` produces **this useful artifact or decision**, with **this evidence**, while respecting **this boundary**.

If the sentence needs several “and” clauses, reduce scope.

## Test three behaviors

1. **Intended:** the normal input exercises the core GTM job.
2. **Edge or insufficient evidence:** missing or ambiguous data should create visible uncertainty, a request for input, or abstention.
3. **Failure, exclusion, or safety:** the skill respects a prohibited action, exclusion rule, invalid input, or approval gate.

Record the expectation before interpreting the output. Preserve failures and limitations; they help the jury distinguish tested behavior from a happy-path story.

For each case record:

- Input or committed input path.
- Expected behavior or invariant.
- Observed result.
- Pass or fail.
- Inspectable evidence path.

A custom runner is optional. A small evidence table is better than an elaborate framework that consumes the build window.

## Build the fallback

Commit a real Prior Output produced during the event. Include enough context to explain its input, time, sources, and limitations. Never call cached evidence a live result.

During the demo, switch to the Prior Output immediately if the visible step approaches 60 seconds or a dependency fails.

## Rehearse from the control surface

Open only `DEMO.md` and verify that a presenter can:

1. State the problem.
2. Copy the exact Seed Prompt.
3. Locate the representative input.
4. Recognize the meaningful live result.
5. Open the Prior Output without searching.
6. Summarize all three eval cases.
7. State the material limitation.

Finally, run `CHECK_SUBMISSION.md` against a committed candidate and test the exact Seed Prompt from a fresh clone in Codex.
