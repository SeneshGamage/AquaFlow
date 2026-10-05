#!/usr/bin/env bash
# Creates labels, milestones and starter issues for AquaFlow.
# Requires GitHub CLI authenticated (gh auth login). Run from inside the cloned repo.
set -euo pipefail

for l in "backend:0e8a16" "frontend:1d76db" "devops:5319e7" "ai:fbca04" "design:f9d0c4" "security:b60205" "docs:0075ca"; do
  gh label create "${l%%:*}" --color "${l##*:}" --force >/dev/null
done

ms() { gh api repos/:owner/:repo/milestones -f title="$1" -f due_on="$2" >/dev/null || true; }
ms "Week 1 - Foundation"        "2026-10-10T23:59:59Z"
ms "Week 2 - Features & Home"   "2026-10-17T23:59:59Z"
ms "Week 3 - Chatbot & Admin"   "2026-10-24T23:59:59Z"
ms "Week 4 - Deploy & Polish"   "2026-10-31T23:59:59Z"

issue() { gh issue create --title "$1" --body "$2" --label "$3" --milestone "$4" >/dev/null && echo "+ $1"; }

W1="Week 1 - Foundation"
issue "Run backend locally against Docker Postgres/Redis; make tests pass" "docs/DAY-01.md section C. Add Maven wrapper." backend "$W1"
issue "Require JWT_SECRET (remove insecure default)" "Fail fast when unset; dev-only value in application-dev.yml." "security,backend" "$W1"
issue "Allow CORS from the Next.js origin" "http://localhost:3000 for dev; configurable for prod." backend "$W1"
issue "Add Admin role (enum, security rules, seeded admin)" "Separate platform admin from business owner." backend "$W1"
issue "Replace ddl-auto: update with Flyway migrations" "Baseline schema + migrations before first deploy." backend "$W1"
issue "Tailwind v4 theme tokens + base layout" "Ocean palette from docs/DAY-01.md; navbar shell." "frontend,design" "$W1"
issue "Frontend API client + env config" "src/lib/api.ts, NEXT_PUBLIC_API_URL." frontend "$W1"
issue "Auth: login/register with httpOnly-cookie BFF + route guards" "Next.js route handlers + middleware per role." frontend "$W1"
issue "CI green on main" "backend + frontend jobs in .github/workflows/ci.yml." devops "$W1"
issue "Walking-skeleton deployment" "Pick host (docs/ARCHITECTURE.md), deploy hello-world end to end. Create AWS account only now if using AWS." devops "$W1"

W2="Week 2 - Features & Home"
issue "Port Owner pages: dashboard, inventory, orders, shipments" "From legacy/frontend-vite." frontend "$W2"
issue "Port Buyer pages: catalog, my orders, my shipments" "Include place-order dialog." frontend "$W2"
issue "Supplier: order confirm/reject + stock submit (new)" "Were empty files in the original project." "frontend,backend" "$W2"
issue "Fix supplier nav linking to owner-only /shipments" "Known bug in the original." frontend "$W2"
issue "Homepage with coral background video + fish animations" "MP4/WebM <= 3 MB, poster fallback, credits in CREDITS.md." "frontend,design" "$W2"

W3="Week 3 - Chatbot & Admin"
issue "Admin: user management and sign-up approvals" "List/approve/deactivate users, change roles." "frontend,backend" "$W3"
issue "Chatbot backend: LlmClient interface, rate limiting, read-only role-scoped tools" "Key stays server-side." "ai,backend" "$W3"
issue "Chatbot widget UI" "Floating assistant, streaming responses, disclaimer." "ai,frontend" "$W3"
issue "Tests: backend unit/integration + Playwright smoke" "Login -> catalog -> place order." "backend,frontend" "$W3"
issue "Upgrade Spring Boot to a supported version" "3.2.x is outdated." backend "$W3"

W4="Week 4 - Deploy & Polish"
issue "Final hosting + HTTPS (Caddy / platform TLS)" "Free subdomain is fine." devops "$W4"
issue "CD pipeline (deploy on merge to main)" "Replace legacy/ci workflows." devops "$W4"
issue "Backups + basic monitoring" "Nightly pg_dump; free uptime check." devops "$W4"
issue "README screenshots + demo video" "Show roles, homepage, chatbot." docs "$W4"
issue "Final QA: accessibility, performance, mobile" "Lighthouse pass." frontend "$W4"
echo "Done."
