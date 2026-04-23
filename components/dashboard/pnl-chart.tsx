"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toBig, formatBig, Big } from "@/lib/big"
import type { CoinStats } from "@/lib/calculations"
import type { CoinPrice } from "@/lib/coingecko"

interface PnlChartProps {
  coins: CoinStats[]
  prices: CoinPrice[]
}

export function PnlChart({ coins, prices }: PnlChartProps) {
  const priceMap = new Map(prices.map((p) => [p.id, p]))

  const data = coins
    .filter((c) => toBig(c.remainingHoldings).gt(0))
    .map((coin) => {
      const holdings = toBig(coin.remainingHoldings)
      const costPrice = toBig(coin.costPrice)
      const price = priceMap.get(coin.coinId)
      const currentPrice = price ? toBig(price.usd) : new Big(0)
      const value = holdings.mul(currentPrice)
      const costBasis = costPrice.mul(holdings)
      const pnl = value.minus(costBasis).toNumber()

      return {
        name: coin.coinSymbol.toUpperCase(),
        pnl,
      }
    })
    .sort((a, b) => b.pnl - a.pnl)

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">P&L by Coin</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
            No data to display
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">P&L by Coin</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="name" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              formatter={(value) => [
                `$${formatBig(new Big(Number(value ?? 0)), 2)}`,
                "P&L",
              ]}
            />
            <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.pnl >= 0 ? "var(--chart-2)" : "var(--chart-5)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
