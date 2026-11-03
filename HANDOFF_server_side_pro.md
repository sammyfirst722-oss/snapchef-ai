# Handoff: finish SnapChef server-side Pro (for a fresh, cheap session)

Written 2026-11-03. Folder: C:\Users\sammy\snapchef-ai. Branch: feat/server-side-pro (NOT committed yet, NOT pushed).

## What is already done (do not redo)
- New code: lib/entitlements.ts, app/api/stripe/webhook/route.ts, app/api/entitlement/route.ts.
- Changed: app/api/stripe/verify-session, app/api/play-billing/verify, app/api/scan-fridge, app/api/stripe/checkout, lib/rate-limit.ts (getRedis exported), components/snapchef-client.tsx.
- New tests: tests/unit/entitlements.test.ts, tests/integration/stripe-webhook.test.ts, api-scan-fridge-enforce.test.ts, stripe-verify-session.test.ts, tests/helpers/fake-kv.ts.
- `npx vitest run` = 124 tests all pass. Typecheck was clean.
- Server limit on free scans is OFF unless env SERVER_PRO_ENFORCE=true.

## Your job (small, mechanical)
1. In C:\Users\sammy\snapchef-ai run `npm run build`. Report pass/fail with the real output. If it fails, show the error and stop (do not rewrite payment code).
2. If it passes: `git add` ONLY the files listed above plus this handoff file (leave the untracked data/ingredient-guides/*.json alone), then commit on branch feat/server-side-pro. Message: "feat(pro): server-side Pro entitlements, Stripe webhook, optional free-scan cap (off by default)".
3. Add one item to C:\Users\sammy\NEEDS-SAMMY.md listing Sammy's hard stops (below).
4. Tell Sammy the result in plain short words, with a numbered list of next steps.

## Hard stops (do NOT do these)
- No git push, no deploy, no Vercel changes, no Stripe dashboard changes, no money.
- Do not edit the payment logic. If something looks wrong, tell Sammy and a stronger model will look.
- Never print secrets from .env files.

## Sammy's hard stops to list in NEEDS-SAMMY.md
- Create a webhook in the Stripe dashboard pointing to /api/stripe/webhook (events: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted, charge.refunded, charge.dispute.created).
- Put STRIPE_WEBHOOK_SECRET into Vercel (SnapChef, production).
- Later, after a Stripe test-mode run: set SERVER_PRO_ENFORCE=true in Vercel.
- Approve the go-live script (still to be written by a stronger model).
- Before turning enforcement on: check for old Google Play buyers; people with Pro only in browser storage would lose it.
- Not built yet: the emailed restore link (needs an email sender), SimplyBigNews and Prompt Builder versions.

## Still for a stronger model later
- Review the payment code (lib/entitlements.ts, webhook route).
- Write the go-live script.
