# SnapChef AI — Project Rules
Repo: `C:\Users\sammy\snapchef-ai` · Live: https://snapchef-ai-sammy.vercel.app
(Global rules apply. These add to them.)

## Facts
- Production deploys from `main`. Pushing to `main` = going live.
- Android TWA: `C:\Users\sammy\snapchef-twa` (package `app.vercel.snapchef_ai.twa`).

## Brand
- Theme: Emerald Green `#10b981` / `oklch(0.62 0.14 160)`. Never purple or indigo — don't change `--primary`, `--ring`, or `--sidebar-primary` in `app/globals.css` away from it.

## UX
- Never add `select-none` to body; users must be able to copy recipes.
- Never disable pinch-to-zoom (`userScalable: false`).
- Core features to protect in every change:
  - Hands-free cook mode (`components/cook-mode.tsx`): full-screen steps, screen wake lock, auto-detected step timers with audio alerts, collapsible ingredient drawer.
  - Serving scaler (`scaleIngredientAmount` in `lib/recipe-utils.ts`): handles whole numbers, fractions (`1/2`), mixed numbers (`1 1/2`), and ranges (`2-3`).
  - Nutrition panel (`getRecipeNutrition(recipe, multiplier)`).
- Recipes live in `lib/recipes-data.ts`. Each needs: id, title, description, prepTime, cookTime, servings, difficulty, category, cuisine, calories, image, ingredients (name, amount, category, standardKey), and instructions.

## Security
- Never re-introduce developer backdoors (e.g., "Demo Test Pro") into user-facing modals or code paths.
- Pro/paid status is checked server-side only, from a verified Stripe webhook (global rule 5).

## Cost
- Image/recipe AI calls are metered per user with a hard monthly cap (global rule 5).
