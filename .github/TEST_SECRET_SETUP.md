# GitHub Actions Test Secret Configuration

## Overview
The GitHub Actions workflow has been simplified to use a single `TEST` secret that contains the entire `.env.test` configuration. This approach:
- Eliminates duplication of environment variables
- Simplifies workflow maintenance
- Makes it easier to update test configuration
- Reduces the workflow file size significantly

## Setup Instructions

### Step 1: Copy the Test Environment Configuration
The content for the TEST secret is available in `.github/TEST_SECRET_TEMPLATE.txt`

### Step 2: Add the Secret to GitHub
1. Go to your repository on GitHub
2. Navigate to **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret**
4. Name: `TEST`
5. Value: Copy the entire content from `.github/TEST_SECRET_TEMPLATE.txt`
6. Click **Add secret**

### Step 3: Verify the Configuration
The TEST secret should contain:

```env
TZ=UTC
PORT=3333
HOST=0.0.0.0
LOG_LEVEL=info
APP_KEY=nG8PDHpB4CWwd9YXonsPssxGD5nildzPl
NODE_ENV=test

# Swagger
APP_DESCRIPTION="pro-league api for the proleague project test"
APP_NAME=Pro-league
APP_VERSION=1.0.0

# MySQL Configuration
DB_HOST=127.0.0.1
DB_PORT=3306
MYSQL_ROOT_PASSWORD=root
MYSQL_DATABASE=pro_league_test
MYSQL_USER=pro_league_user_test
MYSQL_PASSWORD=pro_league_password_test
```

## How It Works

The workflow now:
1. Creates a `.env.test` file in the backend directory from the TEST secret
2. The AdonisJS test runner automatically loads this `.env.test` file
3. Database migrations run once before all tests (optimized)
4. Tests execute using the configuration from `.env.test`

## Benefits

1. **Single Source of Truth**: All test environment variables are in one place
2. **Easy Updates**: Change the secret once to update all test steps
3. **Cleaner Workflow**: Much shorter and more readable workflow file
4. **No Duplication**: Environment variables are defined once, not repeated for each step
5. **Secure**: Sensitive values remain encrypted in GitHub secrets

## Test Optimizations Applied

1. **Migration Optimization**: Database migrations now run once before all tests in the suite setup, not for every test group
2. **Simplified Environment Loading**: Tests use the standard `.env.test` file loading mechanism
3. **Reduced Workflow Complexity**: Eliminated redundant environment variable declarations

## Troubleshooting

If tests fail with environment variable errors:
1. Verify the TEST secret exists in GitHub repository settings
2. Ensure the TEST secret contains all required variables
3. Check that the `.env.test.example` file is up to date with any new variables
4. Verify that the MySQL service configuration matches the database credentials in TEST

## Local Development

For local testing, continue using `.env.test.example`:
```bash
cd backend
cp .env.test.example .env.test
npm run test:unit
npm run test:functional
```
