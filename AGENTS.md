# Repository Guidelines

## Project Structure & Module Organization

This is a small Next.js app using the App Router. Main code lives in `src/app/`: `page.tsx` contains the interactive itinerary UI, `layout.tsx` defines metadata and the root shell, and `globals.css` holds global styling. Typed itinerary data is in `src/lib/data.ts`; keep new trip, day, and dining data there unless it becomes large enough to split. Static PWA assets live in `public/` (`manifest.json`, `sw.js`, icons).

## Build, Test, and Development Commands

Use pnpm for dependency management.

- `pnpm install`: install dependencies and approved builds, including `sharp`.
- `pnpm run dev`: start the local Next development server.
- `pnpm run build`: create a production Next build.
- `pnpm run start`: serve the production build after `pnpm run build`.
- `pnpm run typecheck`: run TypeScript checks with `tsc --noEmit`.

## Coding Style & Naming Conventions

Write TypeScript and React using functional components and hooks. Use two-space indentation, double quotes, and semicolons. Prefer typed data structures in `src/lib/data.ts` over untyped objects. Component names should be `PascalCase`, functions and variables `camelCase`, and string union types should stay narrow, as with `type Tab = "plan" | "trips" | "eats" | "track"`.

CSS is global and class-based. Reuse existing CSS custom properties in `:root` and follow the current kebab-case class naming pattern (`hero-logo`, `tabs-nav`, `week-block`).

## Testing Guidelines

No dedicated test framework is configured yet. Before handoff, run `pnpm run typecheck`; for UI changes, also run `pnpm run dev` and verify the affected tab or interaction manually. If tests are added later, place them near the related source or under `tests/`, and document the new command in `package.json`.

## Commit & Pull Request Guidelines

The history uses short, imperative commit subjects, sometimes with a Conventional Commit prefix, such as `feat: add trip planning data and TypeScript configuration` or `Add mobile-responsive CSS and PWA installability`. Keep subjects specific and under roughly 72 characters.

Pull requests should include a brief summary, changed areas, verification steps, and screenshots or recordings for visible UI changes. Link related issues when available and call out any data, PWA, or deployment-impacting changes.

## Security & Configuration Tips

Do not commit secrets or personal credentials. Environment files are ignored via `.env*`; commit only safe examples such as `.env.example` if needed. Keep generated directories such as `node_modules/`, `.next/`, and `.pnpm-store/` out of version control.
