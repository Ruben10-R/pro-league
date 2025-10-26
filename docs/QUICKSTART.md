# 🚀 Quick Start Guide - Authentication & i18n

## What Was Built

A complete authentication system with internationalization (English & Dutch) including:

- ✅ **Backend API** (AdonisJS) - Register, Login, Logout, Get User
- ✅ **Frontend UI** (Next.js + Mantine) - Forms, Pages, Language Switcher
- ✅ **Shared Types** - TypeScript interfaces across the stack
- ✅ **i18n Support** - Full translation system (EN/NL)
- ✅ **24 Backend Tests** - Comprehensive test coverage

## Prerequisites

Make sure you have Docker running for the MySQL database.

## Step 1: Start the Database

```bash
# From project root
docker-compose up -d mysql
```

## Step 2: Run Database Migrations

```bash
cd backend
npm run db:migrate
```

Expected output:
```
❯ Executed 2 migrations
  └─ create_users_table
  └─ create_access_tokens_table
```

## Step 3: Start the Backend

```bash
# In backend directory
npm run dev
```

Backend will start on: **http://localhost:3333**

You should see:
```
[ info ] starting HTTP server...
[ info ] HTTP server started on http://0.0.0.0:3333
```

## Step 4: Start the Frontend (New Terminal)

```bash
# Open a new terminal
cd frontend
npm run dev
```

Frontend will start on: **http://localhost:3000**

You should see:
```
✓ Ready in 2.5s
➜ Local:   http://localhost:3000
```

## Step 5: Test the Application

### Open in Browser

Visit: **http://localhost:3000**

You'll be redirected to: **http://localhost:3000/en** (default English)

### Test Registration

1. Click **"Register"** button
2. Fill in the form:
   - Full Name: `Test User` (optional)
   - Email: `test@example.com`
   - Password: `password123`
3. Click **"Register"**
4. ✅ You should see success notification
5. ✅ Token is stored in localStorage
6. ✅ Redirected to home page

### Test Login

1. Click **"Login"** button
2. Enter credentials:
   - Email: `test@example.com`
   - Password: `password123`
3. Click **"Login"**
4. ✅ Success notification
5. ✅ Logged in

### Test Language Switching

1. Click the language dropdown (🇬🇧 English)
2. Select **🇳🇱 Nederlands**
3. ✅ UI switches to Dutch
4. ✅ URL changes to `/nl/`
5. Switch back to **🇬🇧 English**
6. ✅ URL changes to `/en/`

### Test Error Handling

**Duplicate Email:**
1. Try to register with `test@example.com` again
2. ✅ Error: "This email is already registered"

**Invalid Credentials:**
1. Try to login with wrong password
2. ✅ Error: "Invalid email or password"

**Password Too Short:**
1. Try to register with password `12345`
2. ✅ Error: "Password must be at least 8 characters"

## API Endpoints

You can also test the API directly:

### Register
```bash
curl -X POST http://localhost:3333/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "api@example.com",
    "password": "password123",
    "fullName": "API User"
  }'
```

### Login
```bash
curl -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "api@example.com",
    "password": "password123"
  }'
```

### Get Current User (Protected)
```bash
# Replace YOUR_TOKEN with the token from login response
curl http://localhost:3333/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Logout (Protected)
```bash
curl -X POST http://localhost:3333/api/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## API Response Format

All responses follow this structure:

**Success:**
```json
{
  "success": true,
  "message": {
    "key": "auth.login.success",
    "params": { "name": "John" }
  },
  "data": {
    "user": { ... },
    "token": { ... }
  }
}
```

**Error:**
```json
{
  "success": false,
  "message": {
    "key": "auth.errors.invalidCredentials",
    "params": {}
  }
}
```

## File Locations

### Backend
- **Controllers**: `backend/app/controllers/auth_controller.ts`
- **Validators**: `backend/app/validators/auth/`
- **Routes**: `backend/start/routes.ts`
- **Tests**: `backend/tests/functional/auth/`

### Frontend
- **Forms**: `frontend/src/components/auth/`
- **Pages**: `frontend/src/app/[locale]/`
- **API Client**: `frontend/src/lib/api/`
- **Translations**: `frontend/src/i18n/locales/`

### Shared
- **Types**: `shared/src/interface/`
- **Enums**: `shared/src/enum/`

## Troubleshooting

### Backend won't start
```bash
# Check if MySQL is running
docker ps | grep mysql

# Restart MySQL
docker-compose restart mysql
```

### Frontend won't start
```bash
# Reinstall dependencies
cd frontend
rm -rf node_modules .next
npm install
```

### Migrations fail
```bash
# Check database connection in backend/.env
cat backend/.env | grep DB_

# Should see:
# DB_HOST=mysql
# DB_PORT=3306
# DB_USER=root
# DB_PASSWORD=password
# DB_DATABASE=pro_league
```

### TypeScript errors
```bash
# Rebuild shared package
cd shared
npm run build
```

## Next Steps

Now that authentication works, you can:

1. **Add Protected Pages** - Create dashboard, profile pages
2. **Add User Roles** - Admin, Organizer, Player
3. **Create Tournaments** - Start building tournament features
4. **Add More Tests** - Frontend tests with Vitest/Playwright
5. **Add Password Reset** - Email verification flow
6. **Add Social Login** - Google, GitHub, etc.

## 🎉 Success!

Your authentication system with full internationalization is now running!

- ✅ Users can register and login
- ✅ Tokens are managed securely
- ✅ Language switching works (EN/NL)
- ✅ All errors are translated
- ✅ Type-safe across the stack

Happy coding! 🚀
