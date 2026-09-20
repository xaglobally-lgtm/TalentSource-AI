# TalentSource — Specification & Build Document

Version: 1.0 (derived from "SOURCE.AI Complete Product & Build Plan V2.1")
Status: In development

---

## 1. Product purpose
Turn every candidate CV/resume into a **verified, structured, recruitment-ready profile**, then
prepare the candidate for interviews and match them to jobs with **inspectable evidence** — running
as an economic service for recruitment agencies.

## 2. Target customer
- Solo recruiters and recruitment agencies who want a sellable "verification + bias-free
  matching" service to offer their clients.
- Candidates who want a credible, verified profile that stands out.

## 3. Problem
Agencies cannot easily prove candidate quality, candidates are misrepresented by generic CV
parsing, and matching is a black box. This destroys trust and slows placement.

## 4. Desired outcome (customer value)
- Candidate: one honest profile, verified facts, readiness score, career-improvement course,
  certificate, and better-matched roles.
- Agency: faster, defensible shortlists; blind-screening for fairness; a white-labelled tool they
  can resell; audit trail for compliance.
- Positioning: "The recruitment tool that verifies candidates, eliminates bias, and explains
  every match."

## 5. Features
### 5.1 Core loop (must work end-to-end)
1. Candidate signs up
2. Uploads CV (PDF/DOCX/TXT)
3. Gemini extracts structured data with confidence + source evidence
4. Candidate reviews, confirms, or edits every section (AI never silently overwrites human-confirmed values)
5. Profile saved as canonical record with audit history
6. Optional professional-development course + assessment
7. Transparent readiness score updates dynamically
8. Recruiter creates job → AI structures requirements (must-have / nice-to-have / exclude)
9. Two-stage engine matches candidates (deterministic filter → LLM evidence scoring)
10. Recruiter shortlists, blind-screening toggle, manages pipeline stages

### 5.2 Supporting features
- Multi-tenant agencies (global candidate identity decoupled from agency records)
- Blind screening (mask name, location, graduation dates, gender indicators)
- Audit trail
- Multi-language UI (target 10+ languages)
- Light/dark mode
- Candidate dossier export
- Certificates with verification code

### 5.3 Features to remove (scope out for launch)
- Fictional "1,420+ Hiring Partners" and "Universal AI Talent Network" marketing claims in the UI
- Any feature that depends on data we cannot persist yet

### 5.4 Features to refine
- i18n coverage (currently only a subset of strings translated)
- Empty/loading/error states
- Mobile responsiveness review

## 6. Architecture
- **Frontend:** React 19 + Vite + Tailwind CSS 4 (keep existing)
- **API:** Express (server.ts) — exposed on Vercel as a serverless function
- **AI:** Gemini `gemini-3.8-flash` via `@google/genai`, server-side only; deterministic local
  fallbacks when no key configured
- **Database & Auth:** Supabase (Postgres + Auth + Storage). Free tier.
- **Hosting:** Vercel, auto-deploy from GitHub
- **Payments:** TBD (Phase 4) — Stripe or Paddle/Lemon Squeezy

### Data flow
```
Candidate → CV upload (Supabase Storage)
  → /api/cv/extract (Gemini, structured JSON + confidence + source quotes)
  → candidate reviews/confirms/edits → saved to Supabase Postgres
  → readiness score (deterministic weighted calc)
Recruiter → job description → /api/job/analyze → structured requirements
  → /api/match/evaluate (Stage 1 deterministic + Stage 2 Gemini evidence)
  → pipeline stages + blind screening
```

## 7. User flow
1. **Landing page** (marketing) → sign up / log in
2. **Candidate:** upload CV → review extraction (diff view) → confirm profile →
   learn (course/assessment) → readiness score → see matches → apply
3. **Recruiter:** manage jobs → AI-structured requirements → match dashboard with
   evidence citations → blind-screening toggle → pipeline board (FOUND…PLACED)
4. **Agency admin:** tenant branding, white-label settings, overview
5. **Super admin (later):** platform-wide course content + governance

## 8. Authentication
- Supabase Auth, email + password (and magic link), later social login
- Roles stored on user record: CANDIDATE / RECRUITER / AGENCY_ADMIN / SUPER_ADMIN
- Supabase RLS enforces agency data isolation (agency_id = auth.jwt() claim)

## 9. Database (Supabase Postgres)
Tables (from spec §18, simplified to what launch requires):
- `agencies` (id, name, slug, tagline, default_locale, branding_json, contact_email)
- `users` (id = auth uid, email, role, agency_id)
- `candidates` (global identity: email, firstName/lastName, master_profile_json, readiness_score)
- `agency_candidate_records` (junction: agency_id, candidate_id, stage, recruiter_notes, tags)
- `candidate_documents` (file_url, file_hash, mime_type)
- `candidate_skills` (skill_name, source, ai_confidence, candidate_confirmed, is_candidate_overridden)
- `jobs` (title, description, structured_requirements_json)
- `job_matches` (job_id, candidate_id, match_score, evidence_json, missing_requirements)
- `audit_events` (tenant_id, actor, action, payload)

## 10. Integrations
- Google Gemini (CV extraction, job analysis, match evaluation)
- Supabase (auth, db, storage)
- Vercel (hosting) — env vars for API keys
- Later: payment provider, email (Resend), analytics (PostHog/Plausible), error tracking (Sentry)

## 11. Payment (Phase 4 — decide with owner)
- Model recommendation: simple subscription tiers (free trial → paid plan) rather than
  outcome-based pricing for V1 (simpler, lower fraud risk).
- Provider: Paddle or Lemon Squeezy recommended for global payments / tax handling, or Stripe.

## 12. Security
- API keys only in server env vars, never client code
- Validate/rate-limit API routes
- Supabase RLS for tenant isolation
- Multipart upload limits; dedupe CVs by SHA-256
- GDPR: candidate deletion endpoint + purge
- Audit logging on confirmation, override, pipeline changes

## 13. Analytics
- Landing/conversion analytics (Plausible or PostHog free tier)
- Usage logging (CV scans, matches run) in audit_events

## 14. Error handling
- Every API route returns clean JSON errors
- UI loading, empty, and error states on all major screens
- Gemini fallbacks so the app never crashes without a key
- Global error boundary

## 15. Deployment
- GitHub repo (account: xaglobal) → Vercel project (user's Vercel account)
- Build command: `npm run build`; output `dist`
- Serverless function exposing Express app
- Env vars: `GEMINI_API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `APP_URL`

## 16. Testing
- Manual test plan per production checklist (master prompt §10)
- Endpoints tested with and without Gemini key (fallback path)
- New-user journey tested end-to-end before launch

## 17. Launch checklist (abridged)
- [ ] App runs in production
- [ ] Auth works; roles enforced
- [ ] CV upload → extraction → confirm → persist works
- [ ] Job analysis + matching works
- [ ] Pipeline + blind screening works
- [ ] Multi-language selector works
- [ ] Payment works (Phase 4)
- [ ] Landing page, pricing, FAQ, contact, terms, privacy live
- [ ] Analytics + error logging live
- [ ] Mobile + desktop checked
- [ ] LIVE URL verified

## 18. Future improvements
- Real-time AI mock interviews (audio)
- Automated multilingual outreach messages
- Cross-agency candidate sharing & commission splits
- Vector search / pgvector semantic matching at scale