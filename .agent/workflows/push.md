---
description: Automates the process of staging changes, committing with a generated Korean message, and pushing to the remote repository. Triggered by "/push" or "푸시해줘".
---

1. Check the current status of the repository.
    - Run `git status`

2. Stage all detected changes.
   // turbo
   - Run `git add .`

3. Commit the changes with an auto-generated message.
   - Generate a concise and descriptive commit message in **Korean** that summarizes the staged changes.
   - Run `git commit -m "Created Korean commit message"`

4. Push the changes to the remote repository.
   // turbo
   - Run `git push`
