# Testing Fixes Summary

## Issues Addressed

### 1. Slow Test Execution Due to Repeated Migrations
**Problem**: `testUtils.db().migrate()` was running for every test suite setup, causing:
- Significantly slower test execution
- Unnecessary database operations
- Potential race conditions

**Solution**: Moved migration to run once in the global setup hook in `backend/tests/bootstrap.ts`

**Changes**:
```typescript
export const runnerHooks: Required<Pick<Config, 'setup' | 'teardown'>> = {
  setup: [
    // Run migrations once before all tests
    () => testUtils.db().migrate(),
  ],
  teardown: [],
}

export const configureSuite: Config['configureSuite'] = (suite) => {
  if (['browser', 'functional', 'e2e', 'unit'].includes(suite.name)) {
    return suite.setup(() => testUtils.httpServer().start())
  }
}
```

### 2. Environment Variable Duplication
**Problem**: 
- Environment variables duplicated in `.env.test.example` and workflow
- Workflow copied `.env.test.example` file creating sync issues
- Mixed approach of secrets and file-based config

**Solution**: Removed .env file dependency, all variables set directly in workflow

**Changes in `.github/workflows/backend-tests.yml`**:
- Removed "Create test environment file" step
- All environment variables now set directly in `env:` sections
- Only `APP_KEY` stored as a GitHub secret

### 3. Test Data Conflicts
**Problem**: 
- Tests using duplicate email addresses
- Token extraction from wrong response object (login vs register)
- Tests failing with 409 (Conflict) errors

**Solution**: Updated all test files to use unique emails and correct token extraction

**Changes**:
- `backend/tests/functional/auth/login.spec.ts`: Unique emails per test
- `backend/tests/functional/auth/logout.spec.ts`: Use register response token
- `backend/tests/functional/auth/me.spec.ts`: Use register response token
- `backend/tests/functional/auth/register.spec.ts`: Already had unique emails

## Test Email Convention

Each test now uses a descriptive, unique email:
- `john@example.com` - valid registration test
- `janewithoutname@example.com` - registration without fullName
- `duplicate@example.com` - duplicate email test
- `logoutuser@example.com` - logout functionality
- `invalidatetoken@example.com` - token invalidation test
- `meuser@example.com` - current user endpoint test
- `revokedtoken@example.com` - revoked token test
- `jane@example.com` - valid login test
- `wrongpassword@example.com` - wrong password test
- `casetest@example.com` - case insensitive test
- `multitoken@example.com` - multiple token generation test

## GitHub Actions Configuration

### Required Secret in TEST Environment

**Only ONE secret is needed**:
- **Name**: `APP_KEY`
- **Value**: 32-character secure random string for encryption

**How to generate**:
```bash
# Recommended method
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Setting up**:
1. GitHub Repository → Settings → Secrets and variables → Actions
2. Environments → test
3. Add secret: `APP_KEY` with your generated value

### Workflow Environment Variables

All test runs include these environment variables:
```yaml
env:
  TZ: UTC
  PORT: 3333
  HOST: 0.0.0.0
  LOG_LEVEL: info
  APP_KEY: ${{ secrets.APP_KEY }}
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

## Benefits of These Changes

1. **Faster Tests**: Migrations run once instead of multiple times
2. **Better Reliability**: No race conditions from parallel migrations
3. **Simpler Configuration**: Single source of truth for environment variables
4. **No Sync Issues**: No need to keep .env file and workflow in sync
5. **Better Security**: Only sensitive data stored as secrets
6. **Clearer Tests**: Each test has unique, descriptive data
7. **Better Isolation**: Tests don't interfere with each other

## Test Execution Flow

1. **Global Setup** (once):
   - Run database migrations
   
2. **Suite Setup** (per suite):
   - Start HTTP server

3. **Test Group Setup** (per group):
   - Truncate database tables

4. **Individual Tests**:
   - Run with clean database state
   - Use unique test data

## Expected Test Results

All 25 tests should now pass:
- ✓ Health check (1 test)
- ✓ Auth - Login (7 tests)
- ✓ Auth - Logout (4 tests)
- ✓ Auth - Me (4 tests)
- ✓ Auth - Register (9 tests)

## Files Modified

1. `backend/tests/bootstrap.ts` - Migration optimization
2. `.github/workflows/backend-tests.yml` - Environment variable consolidation
3. `backend/tests/functional/auth/login.spec.ts` - Unique email addresses
4. `backend/tests/functional/auth/logout.spec.ts` - Token extraction fix
5. `backend/tests/functional/auth/me.spec.ts` - Token extraction fix
6. `backend/tests/functional/auth/register.spec.ts` - Already correct

## Verification

To verify locally (requires Docker):
```bash
# Start database
docker-compose up -d mysql

# Run migrations
cd backend
npm run db:migrate

# Run tests
npm run test:unit
npm run test:functional
```

To verify in GitHub Actions:
1. Set up the `APP_KEY` secret in the test environment
2. Push changes to main or develop branch
3. Check the workflow run in Actions tab
