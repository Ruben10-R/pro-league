# GitHub Actions TEST Secret Configuration

## Summary of Changes

### 1. Test Bootstrap Optimization
- **Changed**: Migrations now run once before all tests in `tests/bootstrap.ts`
- **Benefit**: Significantly faster test execution (no repeated migrations)
- **Location**: `backend/tests/bootstrap.ts`

### 2. Workflow Environment Variables
- **Changed**: Removed dependency on `.env.test` file copy step
- **Changed**: All environment variables are now set directly in the workflow
- **Benefit**: Single source of truth for test configuration, no file duplication
- **Location**: `.github/workflows/backend-tests.yml`

### 3. Test Data Isolation
- **Fixed**: Updated all auth tests to use unique email addresses per test
- **Fixed**: Tests now properly use token from register response instead of login
- **Benefit**: Tests can run in parallel without conflicts
- **Locations**: 
  - `backend/tests/functional/auth/login.spec.ts`
  - `backend/tests/functional/auth/logout.spec.ts`
  - `backend/tests/functional/auth/me.spec.ts`
  - `backend/tests/functional/auth/register.spec.ts`

## GitHub Actions Secret: TEST

The `TEST` environment in GitHub Actions requires only **ONE** secret:

### Secret Name: `APP_KEY`

**Value**: A secure random 32-character string used for encryption

**How to generate**:
```bash
# Option 1: Using Node.js (recommended)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Option 2: Using openssl
openssl rand -base64 32

# Option 3: Using the value from your .env.test.example
# Copy the APP_KEY value from backend/.env.test.example
```

**Example value** (DO NOT use this in production, generate your own):
```
nG8PDHpB4CWwd9YXonsPssxGD5nildzPl
```

### Setting up the Secret in GitHub

1. Go to your repository on GitHub
2. Click on **Settings** → **Secrets and variables** → **Actions**
3. Click on **Environments** → **test**
4. Add the secret:
   - Name: `APP_KEY`
   - Value: [Your generated secure key]

## All Environment Variables in Workflow

The workflow now includes all necessary environment variables directly:

```yaml
env:
  TZ: UTC
  PORT: 3333
  HOST: 0.0.0.0
  LOG_LEVEL: info
  APP_KEY: ${{ secrets.APP_KEY }}        # <-- The only secret needed
  NODE_ENV: test
  APP_DESCRIPTION: "pro-league api for the proleague project test"
  APP_NAME: Pro-league
  APP_VERSION: 1.0.0
  DB_HOST: 127.0.0.1
  DB_PORT: 3306
  MYSQL_ROOT_PASSWORD: root
  MYSQL_DATABASE: pro_league_test
  MYSQL_USER: pro_league_user_test
  MYSQL_PASSWORD: pro_league_password_test
```

## Why This Approach Is Better

1. **No file duplication**: Environment variables are defined once in the workflow
2. **Better security**: Only sensitive data (APP_KEY) needs to be stored as a secret
3. **Easier maintenance**: All test configuration is visible in the workflow file
4. **No sync issues**: No risk of `.env.test.example` and workflow getting out of sync

## Migration Strategy

The workflow no longer needs to:
- Copy `.env.test.example` to `.env.test`
- Maintain duplicate environment variable definitions

All configuration is self-contained in the workflow file, with only the sensitive `APP_KEY` stored as a secret.
