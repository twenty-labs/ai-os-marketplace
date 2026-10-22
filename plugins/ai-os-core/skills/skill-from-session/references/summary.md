# Summary block

Printed right before the last question. Fixed lines, about ten, no prose. Write the values in the owner's language;
ids, paths and commands stay as they are. Leave out a line with nothing to say (`Needs slot` most often).

```
## /<id> · ready to promote
Kind        command (user-invoked) · role <role>
Does        <what it does, one line> → <what it returns>
Removed     <n> project facts (<kinds: file path, numbers, account>)
Overlap     <closest skill> (<the overlapping part>) → points there, not copied
Needs slot  <fact the skill reads that no knowledge slot carries>
Files       SKILL.md · references/<file> · skill.yaml
Checks      validate ✓ · project facts ✓
```

`Checks` shows the two checks the dry run reports: registry validation (shape, size, secrets, licenses) and the
project-facts scan. When the project-facts scan was `partial` (the repository's tracked
files could not be listed), write `project facts ⚠ partial: file names checked by hand` and say which files you read.
