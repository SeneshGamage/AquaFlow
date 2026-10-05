<<<<<<< HEAD
# AquaFlow
Pet Fish market platform
=======
# 🐠 AquaFlow

A full-stack platform for the **pet & ornamental fish market** — it connects fish breeders/suppliers,
pet-shop buyers and the business owner around one workflow: **inventory → orders → shipments**,
with an AI assistant to help users along the way.

> **Status:** portfolio project in active development (target: live by 31 Oct 2026). See [`docs/ROADMAP.md`](docs/ROADMAP.md).

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router), React, TypeScript, Tailwind CSS |
| Backend | Java 17, Spring Boot, Spring Security (JWT), JPA/Hibernate |
| Database | PostgreSQL (Flyway migrations planned), Redis cache (optional) |
| AI assistant | Provider-agnostic LLM service behind the backend (free tier first) |
| DevOps | Docker, GitHub Actions, free-tier hosting |

## Roles

| Role | Purpose |
|---|---|
| **Admin** | Runs the platform: users, sign-up approvals, roles, system settings *(new)* |
| **Owner** | Runs the business: dashboard, inventory, orders, shipments |
| **Supplier** | Confirms/rejects orders, submits stock |
| **Buyer** | Browses the fish catalog, places orders, tracks shipments |

## Repository layout

```
backend/    Spring Boot API (from the original project)
frontend/   Next.js app (new)
infra/      Optional monitoring config (Prometheus) — unverified, revisit in Week 4
docs/       Roadmap, architecture, decisions, daily checklists
legacy/     Original Vite/React app + old CI files — reference only, delete after porting
scripts/    Helper scripts (GitHub issue/milestone seeding)
```

## Run locally

Prerequisites: Git, JDK 17, Maven, Node 22 LTS, Docker.

```bash
cp .env.example .env                 # then set JWT_SECRET:  openssl rand -base64 48
docker compose up -d                 # PostgreSQL + Redis

cd backend && mvn spring-boot:run    # API  -> http://localhost:8080  (Swagger: /swagger-ui.html)

cd frontend && cp ../.env.example .env.local   # keep only NEXT_PUBLIC_API_URL
npm install && npm run dev           # UI   -> http://localhost:3000
```

## Docs
- [Roadmap](docs/ROADMAP.md) · [Architecture](docs/ARCHITECTURE.md) · [Decisions](docs/DECISIONS.md) · [Day 1 checklist](docs/DAY-01.md)

## Credits & license
MIT — see [LICENSE](LICENSE). Image credits in [CREDITS.md](CREDITS.md).
>>>>>>> 8a73092 (docs: add README, roadmap, architecture and decisions)
