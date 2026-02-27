# 🚨 Vercel Environment Variable Update Required

## Issue
Production app (https://mers-app.vercel.app) is down due to expired Prisma Postgres database.

## What I Fixed Locally
✅ Created new Prisma Postgres database
✅ Ran migrations successfully
✅ Updated local `.env.local` with new `DATABASE_URL`
✅ Verified connection works locally

## What You Need to Do
Update the `DATABASE_URL` environment variable in Vercel:

1. Go to: https://vercel.com/aldiyarsemedyarovs-projects/mers-app/settings/environment-variables
2. Find `DATABASE_URL` (or add it if missing)
3. Set it to (for Production):
   ```
   postgresql://d0f109ee7445ac8b13e9fc892132a2fe183dfda1bd8364ceda27419786c9136f:sk_eJdr3O0-ioSATjdIz-oQ3@db.prisma.io:5432/postgres?sslmode=require
   ```
4. Trigger a redeploy or wait for next push

## Alternative: Vercel CLI Auth
If you prefer, you can run:
```bash
vercel login
vercel env add DATABASE_URL production
# paste the connection string above
```

---
**Created:** 2026-02-28 00:58 CET
**Status:** Waiting for manual Vercel dashboard update
