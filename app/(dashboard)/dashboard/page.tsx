"use client"

import { usePortfolioStats } from "@/hooks/use-portfolio-stats"
import { useCoinPrices } from "@/hooks/use-coin-prices"
import { PortfolioSummary } from "@/components/portfolio/portfolio-summary"
import { HoldingsTable } from "@/components/portfolio/holdings-table"
import { AllocationChart } from "@/components/dashboard/allocation-chart"
import { PnlChart } from "@/components/dashboard/pnl-chart"
import { CoinStatsCard } from "@/components/portfolio/coin-stats-card"

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = usePortfolioStats()
  const { data: prices } = useCoinPrices(stats?.coinIds ?? [])

  if (statsLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-muted-foreground">Loading...</div>
      </div>
    )
  }

  const coins = stats?.coins ?? []
  const priceData = prices ?? []

  return (
    <div className="container mx-auto space-y-6 px-4 py-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <PortfolioSummary coins={coins} prices={priceData} />

      <div className="grid gap-6 md:grid-cols-2">
        <AllocationChart coins={coins} prices={priceData} />
        <PnlChart coins={coins} prices={priceData} />
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Holdings</h2>
        <HoldingsTable coins={coins} prices={priceData} />
      </div>

      {coins.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold">Per-Coin Statistics</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {coins.map((coin) => (
              <CoinStatsCard key={coin.coinId} stats={coin} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
