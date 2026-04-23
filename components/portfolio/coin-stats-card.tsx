"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toBig, formatBig } from "@/lib/big"
import type { CoinStats } from "@/lib/calculations"

interface CoinStatsCardProps {
  stats: CoinStats
}

export function CoinStatsCard({ stats }: CoinStatsCardProps) {
  const rows = [
    { label: "Total Bought", value: formatBig(toBig(stats.totalBuyQty), 8) },
    { label: "Total Sold", value: formatBig(toBig(stats.totalSellQty), 8) },
    {
      label: "Remaining",
      value: formatBig(toBig(stats.remainingHoldings), 8),
    },
    {
      label: "Total Buy Cost",
      value: `$${formatBig(toBig(stats.totalBuyCost), 2)}`,
    },
    {
      label: "Total Sell Revenue",
      value: `$${formatBig(toBig(stats.totalSellRevenue), 2)}`,
    },
    {
      label: "Avg Buy Price",
      value: `$${formatBig(toBig(stats.avgBuyPrice), 2)}`,
    },
    {
      label: "Avg Sell Price",
      value: `$${formatBig(toBig(stats.avgSellPrice), 2)}`,
    },
    {
      label: "Cost Price",
      value: `$${formatBig(toBig(stats.costPrice), 2)}`,
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          {stats.coinName}{" "}
          <span className="text-sm text-muted-foreground">
            {stats.coinSymbol.toUpperCase()}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="space-y-1 text-sm">
          {rows.map((row) => (
            <div key={row.label} className="flex justify-between">
              <dt className="text-muted-foreground">{row.label}</dt>
              <dd className="font-medium">{row.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}
