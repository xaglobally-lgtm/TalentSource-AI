# TalentSource — Project State

> Concise state file. Reload this after every context reset before doing work.

## Identity
- **Working name:** TalentSource (spec source document calls it "SOURCE.AI")
- **One-line pitch:** Turn every CV into a verified, structured, recruitment-ready candidate profile — then prepare that candidate for the interview.
- **Target customer:** Recruitment agencies and solo recruiters who need candidate verification + bias-free matching to be sellable to their clients.

## Current state
- Working React + Vite + Express prototype (Google AI Studio export).
- All data lives in React memory only — **nothing persists across refresh**.
- No authentication. No payment. No production landing page.
- 9 languages in the i18n dictionary, but most UI strings are still hardcoded English.
- Type check passes. Dev server runs. **Production build fails locally because the folder path contains `#`** (`#BUILDS`). Vercel builds from GitHub so this does not block deployment.

## Architecture (current → target)
| Layer | Current | Target |
|---|---|---|
| Frontend | React 19 + Vite + Tailwind 4 | Keep as-is |
| API | Express (server.ts) served with Vite | Express adapted to Vercel serverless function |
| AI | Gemini `gemini-3.8-flash` (server-side, fallbacks when no key) | Keep + env key |
| Database | None (in-memory) | Supabase Postgres |
| Auth | None | Supabase Auth (email+pw + magic link), roles |
| Files | None stored | Supabase Storage (CV files) |
| Hosting | Local only | GitHub → Vercel |
| Payments | None | Phase 4 (Stripe/Paddle) |

## Verified working (tested this session)
- `npm run lint` (tsc --noEmit) — PASSES
- Dev server on PORT 4000 (default changed from 3000 to avoid clash with another project on 3000) — WORKS
- `/api/health`, `/api/cv/extract`, `/api/job/analyze`, `/api/match/evaluate` — all respond with structured data via local fallbacks (no API key)
- Model name `gemini-3.8-flash` confirmed valid (Google's current flagship Flash model)
- Frontend calls API via relative `/api/...` paths (works in a single deployment)

## Known blocking issues
1. `#` in folder path breaks `vite build` locally. Fix: move/copy project to clean path OR always build via GitHub/Vercel.
2. No persistence (hard refresh loses everything).
3. No auth middleware exists; roles are a frontend toggle only.
4. Most component labels are hardcoded English; i18n only partially applied.

## Must-have features (production)
1. CV upload → Gemini extraction → human confirm/edit → saved profile (persists)
2. Job analysis → structured requirements
3. 2-stage matching (deterministic + LLM evidence)
4. Recruiter pipeline + blind screening
5. Auth with roles (candidate / recruiter / agency admin / super admin)
6. Multi-tenant isolation (agencies)
7. Multi-language UI (>= 10 languages incl. Thai, Vietnamese, Indonesian, Arabic, Spanish, Chinese, Korean)
8. Light/dark mode
9. Landing page, pricing, payment, access control
10. Terms, privacy, contact, about
11. Analytics + error logging

## Working decisions
- Keep React+Vite (do NOT rewrite to Next.js) — reuse existing UI.
- Use Supabase free tier for DB/Auth/Storage.
- Use Vercel for hosting (user has account); deploy via GitHub (`xaglobal` account, `gh` auth OK).
- Gemini key goes in Vercel env vars (never in client code).
- Data model follows the spec's SQL schema (agencies, candidates, agency_candidate_records, candidate_skills, jobs, job_matches, audit_events).
- Pipeline stages: FOUND → SHORTLISTED → CONTACTED → INTERESTED → SCREENING → INTERVIEW → OFFER → PLACED.

## Decisions still needed
- Move project folder to clean path (no `#`)? (recommended: yes)
- Final commercial name
- Pricing / free limits / payment provider (Phase 4)

## Remaining roadmap
1. P0 Foundation: clean build location, git repo on GitHub, Vercel preview live
2. P1 Persistence: Supabase project + schema + connect data layer
3. P2 Auth: sign-up/login, roles, protected views
4. P3 Core flows on DB (CV upload/storage, jobs, matches, pipeline)
5. P4 Commercial: landing, pricing, payment, limits
6. P5 Hardening: dark mode, i18n coverage, mobile QA, terms/privacy, analytics, error tracking
7. P6 Launch: test as new user, pay test, LIVE verify

## Key files
- `server.ts` — Express API + Gemini engine + fallbacks; PORT now env-configurable
- `src/context/AppContext.tsx` — all app state (in-memory)
- `src/components/CVUploader.tsx`, `ResumeWorkspace.tsx` — CV flow
- `src/components/HybridMatchingViewer.tsx` — matching UI
- `src/types.ts` — data model
- `src/locales/translations.ts` — 9-language dictionary (add th, vi, id, ko later)
- Spec source docs: `../SOURCE recruit new doc.pdf/.docx` (same content)