# Roadmap — 4 Oct → 31 Oct 2026

Goal: AquaFlow live on free-tier infrastructure, with a polished homepage, role-based portals, an Admin
role and an AI assistant. Track work in GitHub Issues/Milestones (`scripts/seed-issues.sh`).

## Week 1 (Oct 4–10) — Foundation
- **Day 1:** repo + clean commit history, local stack, backend running, Next.js theme → [DAY-01.md](DAY-01.md)
- Day 2: CORS · branch protection · Admin role · Flyway migrations · JWT secret required
- Day 3: Next.js auth (login/register) with httpOnly-cookie BFF; protected layouts per role
- Day 4: Shared UI kit (navbar, cards, tables, modals, status badges) from the design showcase
- Day 5: Owner dashboard + inventory (port from `legacy/`)
- Day 6: **Walking-skeleton deploy** (pick host — see ARCHITECTURE.md) so deploy surprises show up early
- Day 7: Buffer / catch-up

## Week 2 (Oct 11–17) — Features & homepage
Owner orders/shipments · Buyer catalog/orders/shipments · Supplier order-confirm + stock-submit
(these were empty files in the original) · Homepage with coral video + fish animations.

## Week 3 (Oct 18–24) — Chatbot & Admin
Admin user management/approvals · chatbot backend (provider interface, rate limiting, read-only tools) ·
chatbot widget · tests (backend unit/integration + a Playwright smoke test).

## Week 4 (Oct 25–31) — Ship it
Final hosting + HTTPS · CD pipeline · backups · basic monitoring · README screenshots + demo video ·
QA, accessibility and performance pass · buffer.

## Cut list (drop these first if time runs short)
Monitoring dashboards · Playwright suite · animated fish extras · Redis replacement · Admin audit log.
