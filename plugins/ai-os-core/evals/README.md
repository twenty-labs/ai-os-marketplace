# Trigger evals

Run from the plugin root: `claude plugin eval .` (it spends model calls on your account). Every grader sets `arm: both`, so the Skill checks count in the two-arm run; add `--ablation none` to skip the no-plugin baseline arm. Positive cases need start-work invoked at least once, the negative case never. Because `arm: both` also applies to the positive Skill graders, the no-plugin baseline arm scores zero on them: read the delta with care, or run with `--ablation none`.
