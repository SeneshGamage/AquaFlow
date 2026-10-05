# Day 1 — Sunday 4 Oct 2026 · "Foundation"  (≈ 3.5 h · 10–13 commits)

**Goal:** repo on GitHub with a clean history and green CI, backend running locally, Next.js booting with the
AquaFlow theme. No new features yet — and that's fine.

## A. Setup (≈ 30 min)
- [ ] Install Git, JDK 17, Maven, Node 22 LTS, Docker Desktop, GitHub CLI (`gh auth login`)
- [ ] Set your identity so commits land on your profile:
  `git config --global user.name "Your Name"` and `git config --global user.email "<id>+<username>@users.noreply.github.com"`
  (use an email that is verified in GitHub → Settings → Emails)
- [ ] ⛔ No AWS account yet (its 6-month free clock starts at signup) — Day 6.

## B. Repo + first commits (≈ 30 min) → 9 commits
- [ ] Put your name in `LICENSE` (don't commit yet)
- [ ] ```bash
  bash scripts/first-commits.sh        # creates 9 logical commits with your identity
  gh repo create aquaflow --public --source=. --remote=origin --push
  bash scripts/seed-issues.sh          # optional: labels, milestones, issues
  ```
- [ ] Repo → Actions: confirm the first CI run (backend may fail until Part C — that's expected)

## C. Backend runs locally (≈ 1 h) → 2–3 commits
- [ ] `cp .env.example .env`, set `JWT_SECRET` (`openssl rand -base64 48`), `docker compose up -d`
- [ ] `cd backend && mvn test`, then `mvn spring-boot:run` → <http://localhost:8080/swagger-ui.html>
- [ ] Register → log in → call a protected endpoint with the token
- [ ] Commit: `mvn wrapper:wrapper` → **`chore(backend): add Maven wrapper`**
- [ ] Commit any fix needed to get tests green → **`fix(backend): …`**
- [ ] Optional (20 min): require `JWT_SECRET` (no default) → **`fix(security): require JWT_SECRET`**

## D. Frontend foundation (≈ 45 min) → 3 commits
- [ ] `cd frontend && npm install && npm run dev`; create `.env.local` → `NEXT_PUBLIC_API_URL=http://localhost:8080`
- [ ] **`feat(frontend): add ocean theme tokens`** — in `src/app/globals.css` (Tailwind v4 `@theme`):
  ```css
  @import "tailwindcss";
  @theme {
    --color-ocean-50:  #f1f8fb;  --color-ocean-100: #e3f0f5;  --color-ocean-200: #cfe2ea;
    --color-ocean-300: #a9c7d3;  --color-ocean-400: #7ba3b3;  --color-ocean-500: #58808f;
    --color-ocean-600: #456a78;  --color-ocean-700: #2f4f5c;  --color-ocean-800: #0f4059;
    --color-ocean-900: #0a2f44;  --color-brand: #0e7490;      --color-accent: #22d3ee;
  }
  ```
- [ ] **`feat(frontend): add API client helper`** — `src/lib/api.ts` (fetch wrapper using `NEXT_PUBLIC_API_URL`)
- [ ] **`feat(frontend): replace boilerplate with AquaFlow placeholder page`**
- [ ] `npm run lint && npm run build` pass

## E. Wrap-up (≈ 10 min)
- [ ] `git push`; CI green; close finished issues; write tomorrow's top 3

## Definition of done ✅
Public repo · ~12 meaningful commits · CI green · Swagger login returns a JWT · themed page at `localhost:3000` · no secrets committed

## Moved to Day 2
CORS for the Next.js origin · branch protection · Admin role · Flyway · Dependabot/secret-scanning toggles.

---
## Commit habits (for a real, honest contribution graph)
- **Small, single-purpose commits**, conventional prefixes: `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `ci:`, `refactor:`.
- From Day 2 use **a branch per issue → pull request → squash merge** (PRs and closed issues count as activity too).
- Aim for steady daily progress (2–5 real commits) rather than bursts. Don't create empty or meaningless commits
  just to colour the graph — recruiters read the commit messages.
- Graph rules: commits count when the email is verified on your account, they're on the **default branch** (or
  merged into it), and the repo isn't a fork. For private repos, enable *Include private contributions* on your profile.
