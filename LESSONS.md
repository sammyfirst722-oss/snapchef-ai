# Lessons Learned

- 2026-09-25: Prioritize permanent system-level CLI & token setup over one-off manual dashboard steps (why: Sammy builds multi-app portfolios and requires zero-touch automation).
- 2026-09-25: Sammy's Google Play account is Organization tier (D-U-N-S verified, 6625546266675165743) — exempt from closed/internal testing gates; roll releases straight to Production (why: testing gates do not apply to verified org accounts).
- 2026-09-25: All apps use OpenRouter (OPENROUTER_API_KEY) with 3-tier fallback architecture — do not ask for or use Gemini API keys (why: OpenRouter prevents credit lockouts and unifies free and paid models).
- 2026-09-25: Prompt Builder is deprioritized; focus engineering effort on SnapChef AI and SimplyBigNews (why: Sammy prioritizes products with highest immediate traction and revenue potential).
