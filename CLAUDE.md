# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server (Next.js + Turbopack)
pnpm build        # Production build
pnpm lint         # ESLint
pnpm format       # Prettier (ts, tsx files)
pnpm typecheck    # TypeScript type checking (tsc --noEmit)
```

Package manager is **pnpm**. Do not use npm or yarn.

Add shadcn components with: `npx shadcn@latest add <component>`

## Architecture

Next.js 16 app router project with React 19, TypeScript (strict), and Tailwind CSS 4.

- `app/` — Routes, layouts, pages (server components by default; mark client components with `"use client"`)
- `components/ui/` — shadcn/ui components (Radix-based, CVA variants)
- `components/` — Custom app-level components
- `hooks/` — Custom React hooks
- `lib/utils.ts` — `cn()` helper (clsx + tailwind-merge)

## Styling

- Tailwind CSS 4 with `@theme` syntax and OKLch color tokens defined in `app/globals.css`
- Dark mode via `next-themes` (class-based toggling, hotkey `d`)
- Component variants use CVA (class-variance-authority)
- Prettier plugin auto-sorts Tailwind classes

## Code Style

- No semicolons, double quotes, 2-space indent, trailing commas (es5)
- Path alias: `@/*` maps to project root
- shadcn config (`components.json`): style `radix-nova`, RSC enabled, icons from `lucide-react`
