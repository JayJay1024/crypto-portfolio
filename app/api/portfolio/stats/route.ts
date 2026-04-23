import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthenticatedUser } from "@/lib/api/auth-guard"
import { computeCoinStats, type CoinStats } from "@/lib/calculations"
import { toBig } from "@/lib/big"

export async function GET() {
  const { user, error } = await getAuthenticatedUser()
  if (error) return error

  const transactions = await prisma.transaction.findMany({
    where: { userId: user!.id },
    select: {
      coinId: true,
      coinSymbol: true,
      coinName: true,
      type: true,
      quantity: true,
      price: true,
    },
    orderBy: { date: "asc" },
  })

  const grouped = new Map<
    string,
    {
      coinSymbol: string
      coinName: string
      txs: { type: "BUY" | "SELL"; quantity: string; price: string }[]
    }
  >()

  for (const tx of transactions) {
    const existing = grouped.get(tx.coinId)
    const entry = {
      type: tx.type,
      quantity: tx.quantity.toString(),
      price: tx.price.toString(),
    }
    if (existing) {
      existing.txs.push(entry)
    } else {
      grouped.set(tx.coinId, {
        coinSymbol: tx.coinSymbol,
        coinName: tx.coinName,
        txs: [entry],
      })
    }
  }

  const coins: CoinStats[] = []
  const coinIds: string[] = []

  for (const [coinId, { coinSymbol, coinName, txs }] of grouped) {
    const stats = computeCoinStats(coinId, coinSymbol, coinName, txs)
    coins.push(stats)
    if (toBig(stats.remainingHoldings).gt(0)) {
      coinIds.push(coinId)
    }
  }

  return NextResponse.json({ coins, coinIds })
}
