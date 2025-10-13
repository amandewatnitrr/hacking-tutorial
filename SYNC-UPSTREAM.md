# How to Sync Your Fork with the Original Repository

This guide explains how to keep your fork up-to-date with changes from the original (upstream) repository.

## 🔄 One-Time Setup

### Step 1: Add the Upstream Remote

First, you need to add the original repository as a remote called "upstream":

```bash
# Navigate to your project directory
cd d:\CLG\OpenSrc\cyber\tree\hacking-tutorial_fork

# Add the upstream remote (replace with actual original repo URL)
git remote add upstream https://github.com/ORIGINAL_OWNER/ORIGINAL_REPO.git

# Verify the new upstream remote
git remote -v
```

You should now see:
```
origin    https://github.com/HarzhMehta/hacking-tutorial_fork.git (fetch)
origin    https://github.com/HarzhMehta/hacking-tutorial_fork.git (push)
upstream  https://github.com/ORIGINAL_OWNER/ORIGINAL_REPO.git (fetch)
upstream  https://github.com/ORIGINAL_OWNER/ORIGINAL_REPO.git (push)
```

---

## 📥 Syncing Process (Repeat as Needed)

### Step 2: Fetch Upstream Changes

Fetch all branches and commits from the upstream repository:

```bash
git fetch upstream
```

### Step 3: Checkout Your Main Branch

Make sure you're on your main branch:

```bash
git checkout main
```

### Step 4: Merge Upstream Changes

Merge the upstream changes into your local main branch:

```bash
git merge upstream/main
```

**Alternative - Rebase (cleaner history):**
```bash
git rebase upstream/main
```

### Step 5: Resolve Conflicts (if any)

If there are merge conflicts:

1. **View conflicted files:**
   ```bash
   git status
   ```

2. **Open each conflicted file** and look for conflict markers:
   ```
   <<<<<<< HEAD
   Your changes
   =======
   Upstream changes
   >>>>>>> upstream/main
   ```

3. **Edit the files** to resolve conflicts manually

4. **Stage the resolved files:**
   ```bash
   git add path/to/resolved/file
   ```

5. **Complete the merge:**
   ```bash
   git commit -m "Merge upstream changes"
   ```

### Step 6: Push to Your Fork

Push the updated main branch to your GitHub fork:

```bash
git push origin main
```

If you used rebase and encounter issues:
```bash
git push origin main --force-with-lease
```

⚠️ **Warning:** Only use `--force-with-lease` on branches where you're the only contributor!

---

## 🚀 Quick Command Summary

### First Time Setup
```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/ORIGINAL_REPO.git
```

### Regular Sync (Run These Commands)
```bash
# 1. Fetch upstream changes
git fetch upstream

# 2. Switch to main branch
git checkout main

# 3. Merge upstream changes
git merge upstream/main

# 4. Push to your fork
git push origin main
```

---

## 🎯 Common Scenarios

### Scenario 1: Simple Sync (No Conflicts)
```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

### Scenario 2: Sync with Local Uncommitted Changes
```bash
# Stash your changes
git stash

# Sync with upstream
git fetch upstream
git checkout main
git merge upstream/main
git push origin main

# Restore your changes
git stash pop
```

### Scenario 3: Sync a Specific Branch
```bash
git fetch upstream
git checkout your-feature-branch
git merge upstream/main
git push origin your-feature-branch
```

### Scenario 4: Discard All Local Changes and Match Upstream
```bash
git fetch upstream
git checkout main
git reset --hard upstream/main
git push origin main --force
```

⚠️ **WARNING:** This will **DELETE** all your local changes!

---

## 🔍 Checking What Changed

### View commits that are in upstream but not in your fork
```bash
git log origin/main..upstream/main
```

### View file differences
```bash
git diff origin/main..upstream/main
```

### View list of changed files
```bash
git diff --name-only origin/main..upstream/main
```

---

## 📋 Best Practices

1. **Sync regularly** - Don't let your fork get too far behind
2. **Commit your work first** - Always commit or stash local changes before syncing
3. **Test after merging** - Run your application to ensure everything works
4. **Keep main branch clean** - Do your work in feature branches
5. **Review changes** - Use `git log` or `git diff` to see what's coming in

---

## 🛠️ Troubleshooting

### Problem: "fatal: 'upstream' does not appear to be a git repository"
**Solution:** You haven't added the upstream remote yet. Run:
```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/ORIGINAL_REPO.git
```

### Problem: "Your local changes would be overwritten by merge"
**Solution:** Stash or commit your changes first:
```bash
git stash
# or
git commit -am "Save local changes"
```

### Problem: Merge conflicts are too complex
**Solution:** Create a backup and start fresh:
```bash
# Create a backup branch
git branch backup-main

# Reset to upstream
git fetch upstream
git reset --hard upstream/main
git push origin main --force
```

### Problem: Accidentally pushed conflicts to GitHub
**Solution:** Force push the corrected version:
```bash
# After resolving conflicts locally
git push origin main --force-with-lease
```

---

## 📊 Workflow Example

Let's say you want to add a new lesson while keeping your fork in sync:

```bash
# 1. Sync with upstream first
git fetch upstream
git checkout main
git merge upstream/main
git push origin main

# 2. Create a feature branch for your new lesson
git checkout -b add-lesson-network-security

# 3. Make your changes (create new lesson files, etc.)
# ... edit files ...

# 4. Commit your changes
git add .
git commit -m "Add new lesson on network security"

# 5. Push to your fork
git push origin add-lesson-network-security

# 6. Create Pull Request on GitHub (if contributing back)
# Or merge into main if just for your fork:
git checkout main
git merge add-lesson-network-security
git push origin main
```

---

## 🔗 Useful Git Commands

### View all remotes
```bash
git remote -v
```

### Remove upstream remote (if needed)
```bash
git remote remove upstream
```

### Rename a remote
```bash
git remote rename old-name new-name
```

### Update upstream URL
```bash
git remote set-url upstream https://github.com/NEW_OWNER/NEW_REPO.git
```

### Fetch all remotes
```bash
git fetch --all
```

---

## 📝 Notes

- **origin** = Your fork (HarzhMehta/hacking-tutorial_fork)
- **upstream** = Original repository (the one you forked from)
- **main** = Default branch name (might be `master` in older repos)

---

**Remember:** Always sync with upstream before starting new work to minimize conflicts!
