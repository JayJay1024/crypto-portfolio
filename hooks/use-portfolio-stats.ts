"use client"

import { useQuery } from "@tanstack/react-query"
import type { CoinStats } from "@/lib/calculations"

interface PortfolioStatsResponse {
  coins: CoinStats[]
  coinIds: string[]
}

async function fetchPortfolioStats(): Promise<PortfolioStatsResponse> {
  const res = await fetch("/api/portfolio/stats")
  if (!res.ok) throw new Error("Failed to fetch portfolio stats")
  return res.json()
}

export function usePortfolioStats() {
  return useQuery({
    queryKey: ["portfolio-stats"],
    queryFn: fetchPortfolioStats,
    staleTime: 30_000,
  })
}
