# SnapChef AI — Workspace Instructions & Rules

- **Brand Theme**: Emerald Green (`oklch(0.62 0.14 160)`). Never revert to purple/indigo.
- **Copy Restrictions**: Never add `select-none` to body. Users must be able to select and copy recipes.
- **Accessibility**: Never disable pinch-to-zoom (`userScalable: false`).
- **Monetization**: No developer backdoors ("Demo Test Pro") in upgrade modals.
- **Features**:
  - Hands-free Cook Mode (`components/cook-mode.tsx`) with wake lock and step timers.
  - Serving size scaler (1x–4x) and dynamic nutrition panel (`lib/recipe-utils.ts`).
  - 110-recipe dataset (`lib/recipes-data.ts`).
- **Production URL**: https://snapchef-ai-sammy.vercel.app
- **TWA Project**: `C:\Users\sammy\snapchef-twa` (Package: `app.vercel.snapchef_ai.twa`)
- **Key Commands**:
  - Test build: `npm run build`
  - Deploy to Vercel: `npx vercel --prod --yes`
  - Build TWA: `cd C:\Users\sammy\snapchef-twa; .\gradlew.bat bundleRelease`
