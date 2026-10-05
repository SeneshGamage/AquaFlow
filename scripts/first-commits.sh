#!/usr/bin/env bash
# Turns the starter files into a clean, logical commit history (9 commits) using YOUR git identity.
# Run once, from the repo root, before pushing.
set -euo pipefail

git config user.name  >/dev/null || { echo "Set your identity first: git config --global user.name \"Your Name\""; exit 1; }
git config user.email >/dev/null || { echo "Set your identity first: git config --global user.email \"you@example.com\""; exit 1; }
[ -d .git ] || git init -b main >/dev/null

c() { local msg="$1"; shift; git add -- "$@"; git commit -q -m "$msg" && echo "✓ $msg"; }

c "chore: add gitignore, gitattributes and MIT license"            .gitignore .gitattributes LICENSE
c "docs: add README, roadmap, architecture and decisions"          README.md docs CREDITS.md
c "chore(backend): import Spring Boot API from original project"   backend
c "chore(frontend): scaffold Next.js app with Tailwind"            frontend
c "chore: add docker compose for PostgreSQL and Redis, env template" docker-compose.yml .env.example
c "ci: add GitHub Actions workflow and Dependabot config"          .github
c "chore(infra): add optional Prometheus monitoring config"        infra
c "chore(legacy): archive original Vite frontend and old CI"       legacy
c "chore: add GitHub issue seeding script"                         scripts

echo; git log --oneline
