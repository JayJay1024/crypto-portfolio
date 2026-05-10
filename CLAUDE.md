# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server (Next.js + Turbopack)
pnpm build        # Production build (runs `prisma generate` first)
pnpm lint         # ESLint
pnpm format       # Prettier (ts, tsx files)
pnpm typecheck    # TypeScript type checking (tsc --noEmit)
```

Package manager is **pnpm**. Do not use npm or yarn.

Add shadcn components with: `npx shadcn@latest add <component>`

After editing `prisma/schema.prisma`, run `pnpm prisma migrate dev` (or `migrate deploy` in CI) and `pnpm prisma generate`.

## Architecture

Next.js 16 app router project with React 19, TypeScript (strict), and Tailwind CSS 4.

- `app/` — Routes, layouts, pages (server components by default; mark client components with `"use client"`)
- `app/api/` — Route handlers: `auth/` (NextAuth + SIWE nonce), `coins/` (CoinGecko proxy), `portfolio/`, `transactions/`
- `components/ui/` — shadcn/ui components (Radix-based, CVA variants)
- `components/{layout,dashboard,portfolio,transactions}/` — feature-grouped app components
- `hooks/` — TanStack Query hooks for server data (`use-transactions`, `use-portfolio-stats`, `use-coin-prices`)
- `lib/utils.ts` — `cn()` helper (clsx + tailwind-merge)
- `lib/big.ts` — `big.js` wrappers (`Big`, `toBig`, `safeDivide`, `clampZero`)
- `lib/calculations.ts` — Single source of truth for PnL / cost basis math
- `lib/stores/` — Zustand stores for client-only UI state (e.g. `ui-store.ts`)
- `lib/wagmi.ts` — Single chain: Arbitrum
- `prisma/schema.prisma` — Postgres via `@prisma/adapter-pg`; models: `User`, `Transaction`

## Conventions

- **Decimal math** — Money and quantity values are strings; do all arithmetic with `big.js` via `lib/big.ts`. Never convert to JS `Number` before computation (precision loss).
- **CoinGecko** — Always go through the `/api/coins/*` proxy. Do not fetch CoinGecko from the client (API key + CORS).
- **Auth** — NextAuth v5 + SIWE (Sign-In with Ethereum). The auth adapter lives in `components/providers.tsx` (`RainbowKitAuthenticationProvider` + `createAuthenticationAdapter`). Treat auth changes as SIWE-specific, not generic OAuth/credentials.
- **State split** — Server data → TanStack Query (`hooks/use-*.ts`). Client UI state → Zustand (`lib/stores/`). Forms → React Hook Form + Zod (`lib/validations/`).
- **Sentry** — Opt-in: `Sentry.init` in `instrumentation-client.ts` / `sentry.{server,edge}.config.ts` only runs when `NEXT_PUBLIC_SENTRY_DSN` / `SENTRY_DSN` are set. If "Sentry isn't capturing events" — check env first. Several config choices are deliberate, not oversights:
  - `sendDefaultPii: false` on all runtimes — wallet addresses / SIWE messages / IPs are PII; do not flip to `true`
  - Client `ignoreErrors` filters wagmi/RainbowKit user-rejection errors (cancelled signatures aren't bugs); don't remove
  - Server `beforeSend` drops CoinGecko 429s (upstream throttle, not actionable); don't remove
  - Replay runs with `maskAllText` + `blockAllMedia` — don't relax without thinking through what gets recorded

## Styling

- Tailwind CSS 4 with `@theme` syntax and OKLch color tokens defined in `app/globals.css`
- Dark mode via `next-themes` (class-based toggling, hotkey `d`)
- Component variants use CVA (class-variance-authority)
- Prettier plugin auto-sorts Tailwind classes

## Code Style

- No semicolons, double quotes, 2-space indent, trailing commas (es5)
- Path alias: `@/*` maps to project root
- shadcn config (`components.json`): style `radix-nova`, RSC enabled, icons from `lucide-react`
