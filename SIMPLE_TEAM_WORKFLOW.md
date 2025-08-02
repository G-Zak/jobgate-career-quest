# Simple Team Workflow - Protected Main Branch

*Ultra-simple workflow: how to work with protected main branch*

**Reading time: less than 2 minutes**

---

## A. What We Must Do for Each New Feature

### 1. Update Local Copy
```bash
git checkout main
git pull
```

### 2. Create Personal Branch
```bash
git checkout -b feat/my-feature
```

### 3. Code → Commit
```bash
git add .
git commit -m "feat: my new feature"
```

### 4. Sync When Needed
```bash
git pull --rebase origin main
```

### 5. Push Branch
```bash
git push -u origin feat/my-feature
```

### 6. Open Pull Request (main ← feat/my-feature)
- Click **"Compare & pull request"** button on GitHub
- Add description of changes
- Request review

### 7. Fix/Complete Until PR Shows ✅ Approved

---

## B. What (Owner) Must Do

| Step | Action |
|------|--------|
| 1 | Open the PR, read the changes |
| 2 | Leave comments if needed |
| 3 | Click **Approve** when it's OK |
| 4 | Click **Merge** (or **Squash & Merge**) |
| 5 | Click **Delete branch** to clean up |

Because you checked "Restrict updates", only accounts listed in "Bypass" (you, possibly a lead) can press Merge.

---

## C. What to Do If There Are Conflicts?

The teammate executes:

```bash
git checkout feat/my-feature
git pull --rebase origin main   # or git merge origin/main
# resolve conflicts on screen
git add resolved_files
git rebase --continue           # or git commit
git push --force-with-lease     # updates the PR
```

Once conflicts are resolved, you resume the review.

---

## Quick Reference Card

### For Teammates (Daily Workflow):
```bash
# Start new feature
git checkout main && git pull
git checkout -b feat/feature-name

# Work and commit
git add . && git commit -m "feat: description"

# Before pushing (if main has new changes)
git pull --rebase origin main

# Push and create PR
git push -u origin feat/feature-name
# → Go to GitHub → Create Pull Request
```

### For Owner (Review Workflow):
1. **Review** → Check code changes
2. **Comment** → Ask questions or request changes
3. **Approve** → When satisfied with changes
4. **Merge** → Integrate into main
5. **Delete** → Clean up feature branch

---

## Team Rules

### ✅ DO:
- Always work on feature branches
- Use descriptive branch names (`feat/user-auth`, `fix/login-bug`)
- Write clear commit messages
- Rebase before pushing if main has changed
- Test your changes before creating PR

### ❌ DON'T:
- Never push directly to main
- Don't force push to shared branches (except with `--force-with-lease`)
- Don't merge your own PRs (unless emergency)
- Don't leave PRs open for days without communication

---

## Common Scenarios

### Scenario 1: Simple Feature (No Conflicts)
```bash
git checkout main && git pull
git checkout -b feat/new-button
# make changes
git add . && git commit -m "feat: add submit button"
git push -u origin feat/new-button
# Create PR on GitHub → Wait for approval → Merge
```

### Scenario 2: Feature with Conflicts
```bash
# After creating PR, main branch has new changes
git checkout feat/my-feature
git pull --rebase origin main
# Fix conflicts in files
git add . && git rebase --continue
git push --force-with-lease
# PR automatically updates → Wait for approval
```

### Scenario 3: Multiple Small Changes
```bash
# Work in small commits
git add file1.js && git commit -m "feat: add validation"
git add file2.js && git commit -m "feat: add error handling"
git add file3.js && git commit -m "feat: add tests"
git push
# All commits appear in single PR
```

---

## Emergency Procedures

### If You Accidentally Committed to Main:
```bash
# Move commit to new branch
git branch feat/rescue-my-work
git reset --hard HEAD~1
git checkout feat/rescue-my-work
git push -u origin feat/rescue-my-work
# Create PR normally
```

### If Force Push Needed:
```bash
# Only use --force-with-lease (safer)
git push --force-with-lease origin feat/my-branch
# Never use --force on shared branches
```

---

## Success Checklist

### Before Creating PR:
- [ ] Branch is up to date with main
- [ ] All tests pass locally
- [ ] Code follows team standards
- [ ] Commit messages are clear
- [ ] No debugging code left behind

### Before Merging PR:
- [ ] Code review completed
- [ ] All conversations resolved
- [ ] CI/CD checks pass
- [ ] No merge conflicts
- [ ] Feature tested by reviewer

---

**Remember: When in doubt, communicate with the team! 🤝**
