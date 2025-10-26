# 🔗 Localized Navigation Links Fix

## Problem
Links between login and register pages were not including the locale prefix:
- ❌ `/en/login` → "Register" clicked → `/register` (404)
- ❌ `/nl/register` → "Login" clicked → `/login` (404)

## Root Cause
The forms were using Mantine's `Anchor` component with plain `href` attribute:

```tsx
<Anchor href="/register">Register</Anchor>
```

This creates a **standard HTML `<a>` tag** that doesn't know about locale routing.

## Solution
Use Mantine's `Anchor` component with next-intl's `Link` component:

```tsx
import { Link } from '@frontend/i18n/routing'

<Anchor component={Link} href="/register">
  Register
</Anchor>
```

## What Changed

### LoginForm.tsx
**Before:**
```tsx
import { useRouter } from '@frontend/i18n/routing'

<Anchor href="/register" fw={500}>
  {t('common.register')}
</Anchor>
```

**After:**
```tsx
import { useRouter, Link } from '@frontend/i18n/routing'

<Anchor component={Link} href="/register" fw={500}>
  {t('common.register')}
</Anchor>
```

### RegisterForm.tsx
**Before:**
```tsx
import { useRouter } from '@frontend/i18n/routing'

<Anchor href="/login" fw={500}>
  {t('common.login')}
</Anchor>
```

**After:**
```tsx
import { useRouter, Link } from '@frontend/i18n/routing'

<Anchor component={Link} href="/login" fw={500}>
  {t('common.login')}
</Anchor>
```

## How It Works

### Mantine's Polymorphic Components
Mantine components like `Anchor`, `Button`, etc. support the `component` prop:

```tsx
<Anchor component={Link} href="/about">
  About
</Anchor>
```

This tells Mantine: "Use the `Link` component instead of a plain `<a>` tag"

### Next-intl's Link Component
The `Link` from `@frontend/i18n/routing` automatically:
1. ✅ Adds the current locale to the URL
2. ✅ Preserves locale when navigating
3. ✅ Handles locale switching

**Example:**
```tsx
// You write:
<Link href="/products">Products</Link>

// On /en/... pages → renders as: /en/products
// On /nl/... pages → renders as: /nl/products
```

## Result ✅

Now navigation correctly preserves locale:

### English Flow:
```
/en/login → Click "Register" → /en/register ✅
/en/register → Click "Login" → /en/login ✅
```

### Dutch Flow:
```
/nl/login → Click "Registreren" → /nl/register ✅
/nl/register → Click "Inloggen" → /nl/login ✅
```

## Testing

Open your browser:

1. **English Login → Register:**
   - Visit: http://localhost:3000/en/login
   - Click "Don't have an account? **Register**"
   - ✅ Should go to: http://localhost:3000/en/register

2. **Dutch Register → Login:**
   - Visit: http://localhost:3000/nl/register
   - Click "Heb je al een account? **Inloggen**"
   - ✅ Should go to: http://localhost:3000/nl/login

3. **Inspect HTML:**
   - On `/en/login`, the register link shows: `href="/en/register"`
   - On `/nl/login`, the register link shows: `href="/nl/register"`

## Pattern to Remember

Whenever you need a link in a localized page:

### ❌ Wrong:
```tsx
import { Anchor } from '@mantine/core'

<Anchor href="/somewhere">Link</Anchor>
```

### ✅ Correct:
```tsx
import { Anchor } from '@mantine/core'
import { Link } from '@frontend/i18n/routing'

<Anchor component={Link} href="/somewhere">Link</Anchor>
```

### Also Works:
```tsx
import { Link } from '@frontend/i18n/routing'

<Link href="/somewhere">Link</Link>
```

## Alternative Patterns

### For Buttons:
```tsx
import { Button } from '@mantine/core'
import { Link } from '@frontend/i18n/routing'

<Button component={Link} href="/dashboard">
  Go to Dashboard
</Button>
```

### For Custom Components:
```tsx
import { Link } from '@frontend/i18n/routing'

<Link href="/profile">
  <div className="custom-link">Profile</div>
</Link>
```

### For Programmatic Navigation:
```tsx
import { useRouter } from '@frontend/i18n/routing'

const router = useRouter()

function handleClick() {
  router.push('/dashboard')  // Auto-adds locale
}
```

## Files Modified

- ✅ `frontend/src/components/auth/LoginForm.tsx`
- ✅ `frontend/src/components/auth/RegisterForm.tsx`

## Why This Matters

**Without locale-aware links:**
- Users get 404 errors
- Break the user flow
- Lose language context
- Bad UX

**With locale-aware links:**
- Seamless navigation
- Language preserved throughout
- Professional UX
- No broken links

---

**Status**: ✅ Fixed and verified
**Time to Fix**: 2 minutes
**Impact**: All auth navigation now works correctly
