# Decisions (lightweight ADRs)

1. **Monorepo** (`backend/`, `frontend/`) — one repo, one CI, easier to show as a portfolio piece.
2. **Next.js App Router** replaces the Vite SPA; the old app is kept in `legacy/` only as a porting reference.
3. **Separate Admin role** (platform/users) from Owner (business). Registration requires approval.
4. **Flyway** replaces `ddl-auto: update` before first deployment.
5. **LLM behind an interface**, server-side only, read-only tools, rate-limited.
6. **Media as MP4/WebM** with poster fallback; credits tracked in `CREDITS.md`.
