# GitHub Secret Setup Guide

## Quick Setup: TEST Environment Secret

### What You Need to Add

**Environment**: `test`  
**Secret Name**: `APP_KEY`  
**Secret Value**: `nG8PDHpB4CWwd9YXonsPssxGD5nildzPl`

*(This is the same value from your `.env.test.example` file)*

---

## Step-by-Step Instructions

### 1. Navigate to Repository Settings
1. Go to your GitHub repository: https://github.com/[your-username]/pro-league
2. Click **Settings** (top right, near the repository name)

### 2. Access Environments
1. In the left sidebar, click **Secrets and variables**
2. Click **Actions**
3. Click on the **Environments** tab (or **New environment** if none exist)

### 3. Configure TEST Environment
1. If the `test` environment doesn't exist:
   - Click **New environment**
   - Name it: `test`
   - Click **Configure environment**

2. If the `test` environment exists:
   - Click on `test` in the environments list

### 4. Add the Secret
1. Scroll to **Environment secrets** section
2. Click **Add secret**
3. Fill in the details:
   - **Name**: `APP_KEY`
   - **Secret**: `nG8PDHpB4CWwd9YXonsPssxGD5nildzPl`
4. Click **Add secret**

### 5. Verify Setup
After adding the secret, you should see:
- Environment name: `test`
- Secret name: `APP_KEY` (value is hidden)
- Status: Active

---

## Why Only One Secret?

The workflow now includes all non-sensitive configuration directly in the workflow file. Only the `APP_KEY` (used for encryption/security) needs to be kept secret.

All other variables like database credentials, ports, and app metadata are set directly in the workflow's `env:` sections.

---

## Testing the Setup

After adding the secret:

1. **Push your changes** to the `main` or `develop` branch:
   ```bash
   git add .
   git commit -m "fix: optimize test execution and fix test failures"
   git push origin main
   ```

2. **Monitor the workflow**:
   - Go to the **Actions** tab in your repository
   - Click on the latest workflow run
   - Verify all tests pass

---

## Troubleshooting

### If tests fail with "APP_KEY not set":
- Verify the secret is named exactly `APP_KEY` (case-sensitive)
- Verify the secret is in the `test` environment
- Re-run the workflow

### If tests fail with database errors:
- The workflow includes a MySQL service that automatically starts
- Check the "Wait for MySQL" step completed successfully

### If tests fail with "duplicate entry" errors:
- This should not happen anymore with the fixes
- If it does, check that `testUtils.db().truncate()` is running in each test group

---

## Alternative: Generate a New APP_KEY

If you prefer not to use the example key, generate a new one:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Or using OpenSSL
openssl rand -base64 32
```

Use the generated value as your `APP_KEY` secret.

---

## Summary

✅ **One secret to add**: `APP_KEY`  
✅ **Value**: `nG8PDHpB4CWwd9YXonsPssxGD5nildzPl`  
✅ **Location**: GitHub → Repository → Settings → Secrets and variables → Actions → Environments → test  

That's it! Your tests will now run successfully in GitHub Actions.
