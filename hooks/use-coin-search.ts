"use client"

import { useDeferredValue } from "react"
import { useQuery } from "@tanstack/react-query"
import type { CoinSearchResult } from "@/lib/coingecko"

async function fetchCoinSearch(query: string): Promise<CoinSearchResult[]> {
  const res = await fetch(`/api/coins/search?q=${encodeURIComponent(query)}`)
  if (!res.ok) throw new Error("Failed to search coins")
  return res.json()
}

export function useCoinSearch(query: string) {
  const deferredQuery = useDeferredValue(query)

  return useQuery({
    queryKey: ["coin-search", deferredQuery],
    queryFn: () => fetchCoinSearch(deferredQuery),
    enabled: deferredQuery.length >= 1,
    staleTime: 5 * 60 * 1000,
  })
}
