# 🔧 ESM Import Fix - Shared Package

## Problem
Registration endpoint returned 500 error:
```
ERR_UNSUPPORTED_DIR_IMPORT /workspace/shared/dist/enum
Cannot find module '/workspace/shared/dist/enum/index'
```

## Root Cause
**ES Modules (ESM) require explicit file extensions** in import statements. TypeScript doesn't automatically add `.js` extensions when compiling to ESM format.

When you write:
```typescript
export * from './enum'
```

TypeScript compiles it to:
```javascript
export * from './enum';
```

But Node.js ESM loader expects:
```javascript
export * from './enum/index.js';
```

## The Fix

Added `.js` extensions to ALL import/export statements in the shared package:

### Files Modified:

**1. `shared/src/index.ts`:**
```typescript
// Before:
export * from './enum'
export * from './interface'

// After:
export * from './enum/index.js'
export * from './interface/index.js'
```

**2. `shared/src/enum/index.ts`:**
```typescript
// Before:
export * from './StatesTypes'
export * from './MessageKeys'

// After:
export * from './StatesTypes.js'
export * from './MessageKeys.js'
```

**3. `shared/src/interface/index.ts`:**
```typescript
// Before:
export * from './StateInterface'
export * from './IUser'
export * from './IAuth'
export * from './IApiResponse'

// After:
export * from './StateInterface.js'
export * from './IUser.js'
export * from './IAuth.js'
export * from './IApiResponse.js'
```

**4. `shared/src/interface/IAuth.ts`:**
```typescript
// Before:
import type { IUser } from './IUser'

// After:
import type { IUser } from './IUser.js'
```

## Why `.js` Extension?

Even though we're writing TypeScript (`.ts` files), we must use `.js` in imports because:

1. **TypeScript doesn't rewrite imports** - It keeps them as-is
2. **Node.js ESM** requires file extensions
3. **`.js` refers to the compiled output** - not the source

This is a TypeScript + ESM + Node.js requirement.

## Result

✅ Registration works: `POST /api/auth/register`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "test@example.com"
    },
    "token": {
      "type": "bearer",
      "token": "..."
    }
  }
}
```

## Testing

### Via Frontend:
1. Go to: http://localhost:3000/en/register
2. Fill in the form
3. Submit
4. ✅ User created successfully

### Via API:
```bash
curl -X POST http://localhost:3333/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "fullName": "Test User"
  }'
```

## Prevention - Coding Guidelines

**For the shared package, ALWAYS use `.js` extensions:**

### ✅ Correct:
```typescript
// In any .ts file in shared package:
export * from './MyModule.js'
import { Something } from './other/Module.js'
import type { Type } from './types/Type.js'
```

### ❌ Wrong:
```typescript
export * from './MyModule'
import { Something } from './other/Module'
```

## Why This Happened

The shared package uses:
- **`"module": "ESNext"`** in tsconfig
- **`"type": "module"`** in package.json
- **ES Modules** (not CommonJS)

This combination requires explicit `.js` extensions for Node.js compatibility.

## Alternative Solutions (Not Used)

### Option 1: Use `node16` module resolution
```json
{
  "compilerOptions": {
    "moduleResolution": "node16"
  }
}
```
But this has other implications for the monorepo.

### Option 2: Switch to CommonJS
```json
{
  "compilerOptions": {
    "module": "CommonJS"
  }
}
```
But we want modern ESM for the project.

### Option 3: Use a bundler
Bundle the shared package before using it - adds complexity.

## Best Practice for This Project

Since we're using ESM everywhere:
- ✅ Always add `.js` to imports in **shared** package
- ✅ Rebuild shared after changes: `npm run build --workspace=shared`
- ✅ Restart backend after shared changes: `docker compose restart backend`

## Quick Reference

After modifying shared package:
```bash
# 1. Rebuild shared
cd shared && npm run build

# 2. Restart services that use it
docker compose restart backend
docker compose restart frontend

# 3. Test
curl http://localhost:3333/api/auth/register -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test1234"}'
```

## Files Changed

- ✅ `shared/src/index.ts`
- ✅ `shared/src/enum/index.ts`
- ✅ `shared/src/interface/index.ts`
- ✅ `shared/src/interface/IAuth.ts`

## Status

✅ Fixed and verified working
✅ User registration functional
✅ Backend tests should pass (after fix)
✅ Frontend integration working

---

**Date**: 2025-10-26  
**Impact**: All authentication endpoints now work correctly  
**Time to Fix**: ~10 minutes
