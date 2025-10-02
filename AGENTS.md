# Repository Guidelines

## Project Structure & Module Organization

Source code lives in `src/`, split by concern: `config.ts` reads env and cursor settings, `constants.ts` defines label metadata, `label.ts`/`set-labels.ts` manage label creation, `set-posts.ts` provisions example posts, and `main.ts` orchestrates Jetstream ingestion plus HTTP servers. Metrics helpers sit in `metrics.ts`; cross-cutting types and logging live in `types.ts` and `logger.ts`. Runtime assets such as `.env`, `cursor.txt`, and the Bun-managed `bun.lock` should remain at the repo root. Keep generated files (logs, build artifacts) out of version control.

## Build, Test, and Development Commands

Install dependencies with `bun install`. Start the labeler with `bun run start`; use `bun run dev` for a watch-mode loop. Run `bun run set-posts` or `bun run set-labels` after adjusting `src/constants.ts` to sync posts/labels. Lint with `bun run lint`, auto-fix with `bun run lint:fix`, and format consistently using `bun run format` before opening a pull request.

## Coding Style & Naming Conventions

Code is TypeScript using ES modules. Favor named exports for new utilities and reserve default exports for singleton services (e.g., `logger.ts`). Follow two-space indentation, `camelCase` for functions and variables, `PascalCase` for types/interfaces, and `UPPER_SNAKE_CASE` for constants mirrored in `config.ts`. Prettier and ESLint enforce styling—run them locally and address warnings instead of ignoring rules. Maintain clear async error handling; prefer early returns over deeply nested conditionals.

## Testing Guidelines

Automated tests are not yet configured. When modifying behavior, exercise flows manually: run `bun run start` against a test labeler account and confirm Jetstream events apply expected labels; rerun `bun run set-posts` and `bun run set-labels` to verify content updates. If you introduce formal tests, place them under `src/__tests__/` and document the command you add to `package.json`.

## Commit & Pull Request Guidelines

Write commits in present-tense imperative (the history currently uses short, descriptive titles such as "Initial commit"). Group related changes and avoid mixing refactors with feature work. Pull requests should explain the problem, summarize the solution, call out config or schema changes, and list manual verification steps. Attach screenshots or logs when UI or operational behavior changes, and link Bluesky issue trackers or tasks when relevant.

## Environment & Security Notes

Keep secrets out of the repo—populate `.env` locally and in deployment platforms. Regenerate `cursor.txt` only if you intentionally reset ingestion. Never commit actual signing keys or DID identifiers; use placeholders in docs and samples. When testing web exposure, bind to localhost unless you specifically need external access.
