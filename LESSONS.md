# Lessons Learned

- 2026-09-25: Prioritize permanent system-level CLI & token setup over one-off manual dashboard steps (why: Sammy builds multi-app portfolios and requires zero-touch automation).
- 2026-09-25: Sammy's Google Play account is Organization tier (D-U-N-S verified, 6625546266675165743) — exempt from closed/internal testing gates; roll releases straight to Production (why: testing gates do not apply to verified org accounts).
- 2026-09-25: All apps use OpenRouter (OPENROUTER_API_KEY) with 3-tier fallback architecture — do not ask for or use Gemini API keys (why: OpenRouter prevents credit lockouts and unifies free and paid models).
- 2026-09-25: Prompt Builder is deprioritized; focus engineering effort on SnapChef AI and SimplyBigNews (why: Sammy prioritizes products with highest immediate traction and revenue potential).
- 2026-09-26: Always compress mobile camera uploads on the client with HTML5 canvas before sending to Vercel API routes (why: smartphone photos are 10MB-25MB and crash Vercel's strict 4.5MB serverless payload limit).
- 2026-09-26: Always read reply summaries aloud using C:\Users\sammy\speak.ps1 (why: Sammy explicitly instructed to read all messages aloud going forward).
- 2026-09-26: Never declare work done on code compilation alone; verify on the physical device and ensure state persistence and passive income loops are closed (why: SnapChef passed all automated tests but had dead buttons on Sammy's phone because of a domain mismatch).
- 2026-09-26: Always include the version number in APK filenames when copying install builds to Google Drive (why: Sammy cannot tell which file is newest when downloading onto his phone).
- 2026-09-27: Always read full plans, summaries, and questions aloud via C:\Users\sammy\speak.ps1, not just brief opening intros (why: Sammy relies on hearing the full plan and question through his speakers).
- 2026-09-27: Proactively protect Sammy's weekly AI limits and wallet before executing heavy work; offload bulk drafting to free models without waiting for him to ask (why: burning flagship tokens on boilerplate exhausts weekly limits and violates the fiduciary duty to Sammy).
- 2026-09-27: Forecast negative outcomes with percentages and preemptive resolutions (>20% risk must be flagged in advance with a ready-to-use solution) (why: Sammy needs downside protection before committing to moves).
- 2026-09-27: Autonomously supervise, spot-check, and expand the free worker fleet (keep workers up to date and proactively hire new worker bots for emerging tasks) (why: Sammy requires running this like a business with zero ongoing human overhead).
- 2026-09-27: The Hierarchical Compound AI System (HCAS) stays at the core of our setup across all projects (why: Lead Architects direct and review while free local GPU workers execute, preserving flagship token limits and scaling passive income).


- 2026-09-30: Never manually edit or rewrite more than 20 lines of code; ALWAYS delegate bulk UI changes and file rewrites to the local worker fleet in C:\Users\sammy\workers\ (why: saves flagship tokens and enforces HCAS architecture).
