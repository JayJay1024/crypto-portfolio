"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toBig, formatBig, safeDivide } from "@/lib/big"
import { Big } from "@/lib/big"
import type { CoinStats } from "@/lib/calculations"
import type { CoinPrice } from "@/lib/coingecko"

interface PortfolioSummaryProps {
  coins: CoinStats[]
  prices: CoinPrice[]
}

export function PortfolioSummary({ coins, prices }: PortfolioSummaryProps) {
  const priceMap = new Map(prices.map((p) => [p.id, p]))

  let totalValue = new Big(0)
  let totalCostBasis = new Big(0)
  let coinsHeld = 0

  for (const coin of coins) {
    const holdings = toBig(coin.remainingHoldings)
    if (holdings.lte(0)) continue

    coinsHeld++
    const price = priceMap.get(coin.coinId)
    if (!price) continue

    const currentValue = holdings.mul(toBig(price.usd))
    const costBasis = toBig(coin.costPrice).mul(holdings)
    totalValue = totalValue.plus(currentValue)
    totalCostBasis = totalCostBasis.plus(costBasis)
  }

  const totalPnL = totalValue.minus(totalCostBasis)
  const pnlPercent = safeDivide(totalPnL, totalCostBasis).mul(100)
  const isPositive = totalPnL.gte(0)

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Position Value
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${formatBig(totalValue, 2)}</div>
          <p className="text-xs text-muted-foreground">
            {coinsHeld} coin{coinsHeld !== 1 ? "s" : ""} held
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Unrealized P&L
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${isPositive ? "text-green-500" : "text-red-500"}`}
          >
            {isPositive ? "+" : ""}${formatBig(totalPnL, 2)}
          </div>
          <p
            className={`text-xs ${isPositive ? "text-green-500" : "text-red-500"}`}
          >
            {isPositive ? "+" : ""}
            {formatBig(pnlPercent, 2)}%
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Cost Basis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${formatBig(totalCostBasis, 2)}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
