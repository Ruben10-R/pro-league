# 🔧 Next.js 15 i18n Routing Fix

## Problem
The internationalized routes were returning 404 errors:
- ❌ `/en/login` - 404
- ❌ `/nl/register` - 404
- ❌ `/en` - 404/500

**Error in logs:**
```
Error: Route "/[locale]" used `params.locale`. 
`params` should be awaited before using its properties.
```

## Root Cause

**Next.js 15 Breaking Change**: Dynamic route parameters must now be awaited as they return a `Promise`.

This is a **major change** from Next.js 14 where `params` was a plain object.

## What Was Fixed

### 1. **Layout Component** (`app/[locale]/layout.tsx`)

**Before (Next.js 14 style):**
```typescript
export default async function LocaleLayout({
  children,
  params: { locale },  // ❌ Destructuring directly
}: {
  children: React.ReactNode
  params: { locale: string }  // ❌ Plain object
}) {
  // ...
}
```

**After (Next.js 15 style):**
```typescript
export default async function LocaleLayout({
  children,
  params,  // ✅ Keep as-is
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>  // ✅ Promise type
}) {
  // Await params (Next.js 15 requirement)
  const { locale } = await params  // ✅ Await before using
  
  // ...
}
```

### 2. **i18n Request Config** (`i18n/request.ts`)

**Before:**
```typescript
export default getRequestConfig(async ({ locale }) => {
  // This parameter name changed in next-intl for Next.js 15
  return {
    messages: (await import(`./locales/${locale}.json`)).default,
  }
})
```

**After:**
```typescript
export default getRequestConfig(async ({ requestLocale }) => {
  // Use requestLocale and await it
  let locale = await requestLocale
  
  if (!locale || !routing.locales.includes(locale as any)) {
    notFound()
  }

  return {
    locale,  // Explicitly return locale
    messages: (await import(`./locales/${locale}.json`)).default,
  }
})
```

### 3. **Home Page Component** (`app/[locale]/page.tsx`)

**Before:**
```typescript
import { Link } from '@frontend/i18n/routing'

export default function HomePage() {
  // Server component trying to use client-side Link
  return <Link href="/login">...</Link>
}
```

**After:**
```typescript
'use client'  // ✅ Mark as client component

import { Link } from '@frontend/i18n/routing'

export default function HomePage() {
  return <Link href="/login">...</Link>
}
```

**Why?** The `Link` component from `next-intl` navigation is a client component and can't be used directly in server components.

## Result - All Routes Working! ✅

| Route | Status | Description |
|-------|--------|-------------|
| `/` | 307 (Redirect) | Redirects to `/en` (default locale) |
| `/en` | 200 ✅ | English home page |
| `/nl` | 200 ✅ | Dutch home page |
| `/en/login` | 200 ✅ | English login page |
| `/nl/login` | 200 ✅ | Dutch login page |
| `/en/register` | 200 ✅ | English registration page |
| `/nl/register` | 200 ✅ | Dutch registration page |

## Why Pages Are in `[locale]` Directory

This is the **correct and recommended pattern** for Next.js internationalization:

### ✅ **Advantages:**
1. **SEO-Friendly URLs**: `/en/about` vs `/?locale=en&page=about`
2. **Clean Architecture**: Each language is a separate route
3. **Better Performance**: Next.js can optimize per-locale
4. **Search Engine Indexing**: Each language version gets its own URL
5. **Shareable Links**: Users can share language-specific links
6. **Browser History**: Language changes are in history
7. **Next-intl Requirement**: This is how `next-intl` expects routes

### 📁 **Directory Structure:**
```
app/
├── page.tsx                    # ⚠️ Unused (can be deleted)
├── layout.tsx                  # Root layout
└── [locale]/                   # ✅ Locale-based routing
    ├── layout.tsx             # Localized layout with i18n
    ├── page.tsx               # Home page (all locales)
    ├── login/
    │   └── page.tsx           # Login page (all locales)
    └── register/
        └── page.tsx           # Register page (all locales)
```

### 🔄 **How It Works:**
```
User visits: /nl/login
             ↓
Next.js captures: [locale] = "nl"
             ↓
Middleware validates locale
             ↓
Loads Dutch translations
             ↓
Renders: app/[locale]/login/page.tsx with nl messages
```

## Common Pattern for i18n in Next.js

This is the **standard Next.js App Router + next-intl pattern**:

```
app/
└── [locale]/              # Dynamic locale segment
    ├── layout.tsx        # Wraps with i18n providers
    └── (routes...)/      # All your pages
```

**Why not at root?**
- Root `app/` can have non-localized pages (like error pages)
- `[locale]/` ensures every child page has i18n context
- Cleaner separation of localized vs non-localized content

## Next.js 15 Migration Checklist

If you add more dynamic routes, remember:

- [ ] All `params` are now `Promise<{ [key]: string }>`
- [ ] Always `await params` before using
- [ ] Use `'use client'` for pages with client-side navigation
- [ ] Update `next-intl` request config to use `requestLocale`
- [ ] Return `locale` explicitly from `getRequestConfig`

## Testing the Routes

```bash
# Test all routes work
curl http://localhost:3000/             # Should redirect to /en
curl http://localhost:3000/en           # Should return 200
curl http://localhost:3000/nl           # Should return 200
curl http://localhost:3000/en/login     # Should return 200
curl http://localhost:3000/nl/register  # Should return 200

# Test language switching
# 1. Visit http://localhost:3000/en
# 2. Click language switcher → Nederlands
# 3. URL changes to /nl (same page, different language)
```

## References

- [Next.js 15 Dynamic Parameters](https://nextjs.org/docs/messages/sync-dynamic-apis)
- [next-intl v3 with Next.js 15](https://next-intl.dev/docs/getting-started/app-router)
- [App Router Internationalization](https://nextjs.org/docs/app/building-your-application/routing/internationalization)

---

**Status**: ✅ All routes fixed and working
**Changes**: 3 files modified
**Time**: ~15 minutes
**Verified**: All 7 routes returning correct status codes
