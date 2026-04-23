"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { TransactionInput } from "@/lib/validations/transaction"

export interface TransactionRecord {
  id: string
  coinId: string
  coinSymbol: string
  coinName: string
  type: "BUY" | "SELL"
  exchange: "BINANCE" | "OKX" | "GATE" | "BITGET" | "CUSTOM"
  exchangeCustom: string | null
  quantity: string
  price: string
  date: string
  fee: string
  feeUnit: "USDT" | "CRYPTO"
  createdAt: string
  updatedAt: string
}

interface TransactionListResponse {
  data: TransactionRecord[]
  total: number
  page: number
  limit: number
}

interface TransactionParams {
  coinId?: string
  type?: "BUY" | "SELL"
  page?: number
  limit?: number
  sort?: string
  order?: "asc" | "desc"
}

async function fetchTransactions(
  params: TransactionParams
): Promise<TransactionListResponse> {
  const search = new URLSearchParams()
  if (params.coinId) search.set("coinId", params.coinId)
  if (params.type) search.set("type", params.type)
  if (params.page) search.set("page", params.page.toString())
  if (params.limit) search.set("limit", params.limit.toString())
  if (params.sort) search.set("sort", params.sort)
  if (params.order) search.set("order", params.order)

  const res = await fetch(`/api/transactions?${search.toString()}`)
  if (!res.ok) throw new Error("Failed to fetch transactions")
  return res.json()
}

export function useTransactions(params: TransactionParams = {}) {
  return useQuery({
    queryKey: ["transactions", params],
    queryFn: () => fetchTransactions(params),
    staleTime: 30_000,
  })
}

export function useCreateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: TransactionInput) => {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to create transaction")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
      queryClient.invalidateQueries({ queryKey: ["portfolio-stats"] })
    },
  })
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string
      input: TransactionInput
    }) => {
      const res = await fetch(`/api/transactions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to update transaction")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
      queryClient.invalidateQueries({ queryKey: ["portfolio-stats"] })
    },
  })
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to delete transaction")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
      queryClient.invalidateQueries({ queryKey: ["portfolio-stats"] })
    },
  })
}
