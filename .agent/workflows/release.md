---
description: Automates the release process using Semantic Versioning. Updates package.json, Sidebar UI, and creates git tags. Triggered by "/release [patch|minor|major]".
---

1. Determine the increment level from the command (default to `patch` if not specified).
   - Expected input: `/release patch`, `/release minor`, or `/release major`.

2. Read the current version from `package.json`.
   - View `package.json` to get the current version.

3. Calculate the new version based on SemVer rules:
   - **Patch**: Increment the last digit (v0.1.1 -> v0.1.2)
   - **Minor**: Increment the middle digit, reset patch to 0 (v0.1.2 -> v0.2.0)
   - **Major**: Increment the first digit, reset minor and patch to 0 (v0.2.0 -> v1.0.0)

4. Update the version in `package.json`.
   - Modify the `"version"` field in `package.json` with the new version string.

5. Update the version display in `src/components/builder/Sidebar.tsx`.
   - Find the line `vX.Y.Z` in the sidebar footer and update it to the new version.

6. Stage all changes.
   // turbo
   - Run `git add package.json src/components/builder/Sidebar.tsx`

7. Commit the release.
   - Run `git commit -m "chore(release): vNEW_VERSION"`

8. Create a git tag.
   // turbo
   - Run `git tag vNEW_VERSION`

9. Push changes and tags to the remote repository.
   // turbo
   - Run `git push origin main --tags`
