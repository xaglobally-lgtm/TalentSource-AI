# TalentSource-AI

**AI-powered recruitment management for agencies and solo recruiters.**

Turn every CV into a verified, structured, recruitment-ready candidate profile — then match candidates to jobs with inspectable evidence.

## Quick Links

- **Live Demo:** (Set after Vercel deployment)
- **GitHub:** https://github.com/xaglobal/TalentSource-AI
- **Docs:** See `docs/` folder

## Features

- 📄 **AI CV Extraction:** Gemini extracts structured data from PDF/DOCX/TXT
- ✅ **Human Confirmation:** Candidate reviews, confirms, or edits every section
- 📊 **Transparent Readiness Score:** Dynamic scoring based on profile completeness and professional development
- 🎯 **2-Stage Matching:** Deterministic filtering + LLM-powered evidence scoring
- 👁️ **Blind Screening:** Toggle to hide names, locations, dates, gender for bias-free review
- 🌍 **Multi-Language UI:** 10+ languages (English, Thai, Vietnamese, Spanish, Arabic, Chinese, Korean, etc.)
- 🌙 **Dark Mode:** Full light/dark theme support
- 🔐 **Multi-Tenant:** Agencies isolated by tenant; white-label ready

## Tech Stack

| Layer | Tech | Version |
|-------|------|---------|
| Frontend | React | 19.0.1 |
| Build | Vite | 6.2.3 |
| Styling | Tailwind CSS | 4.1.14 |
| Backend | Express | 4.21.2 |
| AI | Gemini 3.8-flash | latest |
| Database | Supabase Postgres | (free tier) |
| Auth | Supabase Auth | (free tier) |
| Storage | Supabase Storage | (free tier) |
| Hosting | Vercel | (free tier) |

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Development

1. **Clone the repo:**
   ```bash
   git clone https://github.com/xaglobal/TalentSource-AI.git
   cd TalentSource-AI
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment:**
   ```bash
   cp .env.example .env.local
   # Add your GEMINI_API_KEY to .env.local
   ```

4. **Run dev server:**
   ```bash
   npm run dev
   ```
   Opens on `http://localhost:4000`

5. **Type check:**
   ```bash
   npm run lint
   ```

### Production Build

```bash
npm run build
npm run start
```

## Deployment

This app is configured for **Vercel** with auto-deploy from GitHub.

**To deploy:**
1. Push to GitHub (main branch)
2. Vercel auto-builds and deploys
3. Set environment variables in Vercel dashboard:
   - `GEMINI_API_KEY`
   - `SUPABASE_URL` (after P2)
   - `SUPABASE_ANON_KEY` (after P2)
   - `APP_URL` (your Vercel deployment URL)

## Documentation

- **Build Plan:** See `docs/SPECIFICATION.md` for full product spec
- **Project State:** See `docs/PROJECT_STATE.md` for quick reference
- **Pricing:** Freemium + Professional subscription + (later) Outcome-based
- **Payment:** Lemon Squeezy for subscription management

## API Endpoints

### Health Check
```
GET /api/health
```
Returns status and version info.

### CV Extraction
```
POST /api/cv/extract
Content-Type: application/json

{
  "documentText": "...",
  "mimeType": "text/plain"
}
```
Extracts structured candidate data from CV text.

### Job Analysis
```
POST /api/job/analyze
Content-Type: application/json

{
  "jobDescription": "..."
}
```
Structures job requirements (must-have, nice-to-have, exclude).

### Candidate Matching
```
POST /api/match/evaluate
Content-Type: application/json

{
  "candidateProfile": {...},
  "jobRequirements": {...}
}
```
Returns match score + evidence (2-stage: deterministic + LLM).

## Build Phases

| Phase | Status | Focus |
|-------|--------|-------|
| P1 | In Progress | GitHub + Vercel preview deployment |
| P2 | Planned | Supabase persistence layer |
| P3 | Planned | Authentication + role-based access |
| P4 | Planned | Core workflows on database |
| P5 | Planned | Landing page + payment integration |
| P6 | Planned | Dark mode + i18n + mobile QA |
| P7 | Planned | Launch + production verification |

## Pricing & Payments

**Tier 1: Freemium** — Free, limited (1 CV, 1 job/month)
**Tier 2: Professional** — $49–99/month, unlimited
**Tier 3: Enterprise** — Custom pricing + outcome-based commission

Payment processing via **Lemon Squeezy** (global coverage, automatic tax handling).

## Support

- **Email:** [Add contact email]
- **Docs:** See `docs/` folder
- **Issues:** GitHub Issues

## License

[Add license here — e.g., MIT, CC-BY]

## Author

Built with ❤️ by XAG Global
