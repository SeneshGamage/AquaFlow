# legacy/

Reference copies of the original project, **not built or deployed**. Delete once everything is ported.

- `frontend-vite/` — original React + Vite UI. Known gaps: the zip was missing `index.html`, the Tailwind/PostCSS
  config, the global CSS and the `@` path alias in `vite.config.ts`. `PlaceOrder`, `TrackShipment`, `OrderConfirm`,
  `StockSubmit` and `RevenueChart` were empty files.
- `ci/` — old per-repo GitHub Actions workflows (CD targeted an Oracle Cloud VM over SSH).
