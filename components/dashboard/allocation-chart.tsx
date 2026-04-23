"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toBig, formatBig, Big } from "@/lib/big"
import type { CoinStats } from "@/lib/calculations"
import type { CoinPrice } from "@/lib/coingecko"

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

interface AllocationChartProps {
  coins: CoinStats[]
  prices: CoinPrice[]
}

export function AllocationChart({ coins, prices }: AllocationChartProps) {
  const priceMap = new Map(prices.map((p) => [p.id, p]))

  const data = coins
    .filter((c) => toBig(c.remainingHoldings).gt(0))
    .map((coin) => {
      const holdings = toBig(coin.remainingHoldings)
      const price = priceMap.get(coin.coinId)
      const value = price ? holdings.mul(toBig(price.usd)).toNumber() : 0

      return {
        name: coin.coinSymbol.toUpperCase(),
        value,
      }
    })
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value)

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
            No holdings to display
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              dataKey="value"
              label={({ name, percent }) =>
                `${name ?? ""} ${((percent ?? 0) * 100).toFixed(1)}%`
              }
              labelLine={false}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [
                `$${formatBig(new Big(Number(value ?? 0)), 2)}`,
                "Value",
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
