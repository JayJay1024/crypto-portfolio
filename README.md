# Crypto Portfolio

A self-hosted crypto portfolio tracker. Connect your wallet, log transactions
(BUY / SELL across multiple exchanges), and get live valuation, allocation,
and per-coin PnL backed by CoinGecko prices.

## Features

- **Wallet sign-in** — SIWE (Sign-In with Ethereum) via RainbowKit + NextAuth
- **Transactions** — record BUY / SELL across Binance, OKX, Gate, Bitget, or
  custom; supports USDT or in-kind fees
- **Dashboard** — total value, allocation pie, historical PnL chart, holdings
  table, per-coin statistics (cost basis, realized / unrealized PnL)
- **Filters** — searchable Combobox by coin, BUY/SELL type filter
- **Theming** — light / dark / system, with `d` hotkey
- **Mobile** — responsive layout with bottom tab navigation

## Tech Stack

- **Framework** — Next.js 16 (App Router, Turbopack), React 19, TypeScript strict
- **Styling** — Tailwind CSS 4, shadcn/ui (radix-nova), `next-themes`
- **State / Data** — TanStack Query, Zustand, React Hook Form + Zod
- **Web3** — wagmi, viem, RainbowKit, SIWE
- **Auth / DB** — NextAuth v5, Prisma (Postgres via `@prisma/adapter-pg`)
- **Math** — `big.js` for safe decimal arithmetic
- **Charts** — Recharts
- **Prices** — CoinGecko API (proxied through `/api/coins/*`)

## Getting Started

Requires Node.js 20+ and **pnpm**. Postgres database is required.

```bash
pnpm install
cp .env.example .env        # then fill in values (see below)
pnpm prisma migrate deploy  # or `pnpm prisma migrate dev` in development
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and connect a wallet on
Arbitrum to sign in.

### Environment Variables

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | Postgres connection string |
| `AUTH_URL` | Base URL of the app (e.g. `http://localhost:3000`) |
| `AUTH_SECRET` | NextAuth secret (`openssl rand -base64 32`) |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | WalletConnect Cloud project ID |
| `COINGECKO_API_KEY` | Optional, increases rate limit |
| `COINGECKO_BASE_URL` | Defaults to `https://api.coingecko.com/api/v3` |

## Scripts

```bash
pnpm dev          # Next.js dev server (Turbopack)
pnpm build        # prisma generate + next build
pnpm start        # Production server
pnpm lint         # ESLint
pnpm format       # Prettier (ts, tsx)
pnpm typecheck    # tsc --noEmit
```

Add a shadcn component:

```bash
npx shadcn@latest add <component>
```

## Project Structure

```
app/
  (auth)/login/        # SIWE sign-in page
  (dashboard)/         # Authenticated routes (dashboard, transactions)
  api/                 # Route handlers (auth, coins, portfolio, transactions)
components/
  ui/                  # shadcn primitives
  layout/              # Header, BottomNav, ThemeToggle, WalletButton
  dashboard/           # Allocation pie, PnL chart
  portfolio/           # Holdings table, per-coin stats
  transactions/        # Transaction table, dialog, filters
hooks/                 # Data hooks (TanStack Query)
lib/
  calculations.ts      # Cost basis / PnL math (big.js)
  wagmi.ts             # Chain + wallet config (Arbitrum)
  coingecko.ts         # Price API wrapper
  stores/              # Zustand stores
prisma/
  schema.prisma        # User + Transaction models
```
