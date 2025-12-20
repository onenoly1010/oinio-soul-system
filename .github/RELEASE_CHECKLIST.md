# Release Checklist

Use this checklist when preparing a new release.

## Pre-Release

- [ ] All PRs for this release are merged to `main`
- [ ] All tests pass locally
- [ ] Version bumped in `config.js`
- [ ] Version bumped in `package.json`
- [ ] CHANGELOG.md updated with all changes
- [ ] README.md updated if needed
- [ ] No open critical bugs

## Build & Test

- [ ] Run `npm run build` to create binaries
- [ ] Run `npm run verify` to test binaries
- [ ] Test `--version` flag on all platforms
- [ ] Test `--help` flag on all platforms
- [ ] Smoke test: create user, create soul, consult oracle
- [ ] Verify file sizes are reasonable (35-55 MB)

## Release

- [ ] Commit version changes: `git add . && git commit -m "Bump version to X.Y.Z"`
- [ ] Push to main: `git push origin main`
- [ ] Create tag: `git tag vX.Y.Z`
- [ ] Push tag: `git push origin vX.Y.Z`
- [ ] GitHub Actions automatically creates release
- [ ] Verify release on GitHub with all 3 binaries
- [ ] Download and test each binary from GitHub release

## Post-Release

- [ ] Announce on Twitter/X
- [ ] Post to Reddit (r/opensource, r/divination)
- [ ] Post to Hacker News (Show HN)
- [ ] Update any external documentation
- [ ] Monitor for issues
- [ ] Respond to community feedback

## Rollback (if needed)

If critical issues are discovered:
- [ ] Delete the tag: `git push origin :refs/tags/vX.Y.Z`
- [ ] Delete the GitHub release
- [ ] Fix issues in a new PR
- [ ] Increment patch version
- [ ] Repeat release process
