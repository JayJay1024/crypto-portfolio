"use client"

import { useQuery } from "@tanstack/react-query"
import type { CoinPrice } from "@/lib/coingecko"

async function fetchCoinPrices(ids: string[]): Promise<CoinPrice[]> {
  const res = await fetch(`/api/coins/prices?ids=${ids.join(",")}`)
  if (!res.ok) throw new Error("Failed to fetch prices")
  return res.json()
}

export function useCoinPrices(coinIds: string[]) {
  const sortedIds = [...coinIds].sort()

  return useQuery({
    queryKey: ["coin-prices", sortedIds],
    queryFn: () => fetchCoinPrices(sortedIds),
    enabled: sortedIds.length > 0,
    refetchInterval: 60_000,
    staleTime: 30_000,
  })
}
