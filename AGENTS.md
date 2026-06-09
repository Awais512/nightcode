# Nightcode

Bun workspace monorepo (`bun.lock`). Three packages under `packages/*`.

## Commands

```sh
bun run dev:cli              # TUI dev (--watch)
bun run dev:server           # Server dev (--hot)
bunx tsc --noEmit            # typecheck (no dedicated script)
```

Per-package: `bun run dev` inside any `packages/*` directory.

## Architecture

| Package | Entry | Role |
|---|---|---|
| `@nightcode/cli` | `packages/cli/src/index.tsx` | TUI app — OpenTUI React, React Router, Hono client |
| `@nightcode/server` | `packages/server/src/index.ts` | Hono HTTP server (port 3000, idleTimeout 255) |
| `@nightcode/shared` | `packages/shared/src/index.ts` | Zod schemas, chat model config |

- CLI depends on server as a **devDependency** for type-safe Hono client (`hc<AppType>`)
- CLI connects to `process.env.API_URL` or `http://localhost:3000` by default
- Server uses in-memory mock data (no real DB yet)

## Quirks

- **`verbatimModuleSyntax`** is on in `tsconfig.base.json` — must use `import type` for type-only imports
- CLI uses `@opentui/react` JSX source (configured in `packages/cli/tsconfig.json`)
- `packages/cli/src/screens/session.tsx.tsx` has a **double `.tsx` extension** — intentional or an accident
- No test runner, no linter, no formatter configured
- `bun run dev:server` uses `--hot`; `bun run dev:cli` uses `--watch`
