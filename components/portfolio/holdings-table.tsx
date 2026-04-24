"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toBig, formatBig, safeDivide, Big } from "@/lib/big"
import type { CoinStats } from "@/lib/calculations"
import type { CoinPrice } from "@/lib/coingecko"

interface HoldingsTableProps {
  coins: CoinStats[]
  prices: CoinPrice[]
}

export function HoldingsTable({ coins, prices }: HoldingsTableProps) {
  const priceMap = new Map(prices.map((p) => [p.id, p]))

  const activeCoins = coins.filter((c) => toBig(c.remainingHoldings).gt(0))

  if (activeCoins.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No holdings yet. Add some transactions to get started.
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Coin</TableHead>
            <TableHead className="text-right">Holdings</TableHead>
            <TableHead className="text-right">Avg Buy</TableHead>
            <TableHead className="text-right">Cost Price</TableHead>
            <TableHead className="text-right">Current Price</TableHead>
            <TableHead className="text-right">Value</TableHead>
            <TableHead className="text-right">PnL</TableHead>
            <TableHead className="text-right">PnL %</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activeCoins.map((coin) => {
            const holdings = toBig(coin.remainingHoldings)
            const costPrice = toBig(coin.costPrice)
            const price = priceMap.get(coin.coinId)
            const currentPrice = price ? toBig(price.usd) : new Big(0)
            const value = holdings.mul(currentPrice)
            const costBasis = costPrice.mul(holdings)
            const pnl = value.minus(costBasis)
            const pnlPercent = safeDivide(pnl, costBasis).mul(100)
            const isPositive = pnl.gte(0)

            return (
              <TableRow key={coin.coinId}>
                <TableCell>
                  <span className="font-medium">{coin.coinName}</span>
                  <span className="ml-1 text-xs text-muted-foreground">
                    {coin.coinSymbol.toUpperCase()}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  {formatBig(holdings, 8)}
                </TableCell>
                <TableCell className="text-right">
                  ${formatBig(toBig(coin.avgBuyPrice), 2)}
                </TableCell>
                <TableCell className="text-right">
                  ${formatBig(costPrice, 2)}
                </TableCell>
                <TableCell className="text-right">
                  {price ? `$${formatBig(currentPrice, 2)}` : "-"}
                </TableCell>
                <TableCell className="text-right">
                  ${formatBig(value, 2)}
                </TableCell>
                <TableCell
                  className={`text-right ${isPositive ? "text-green-500" : "text-red-500"}`}
                >
                  {isPositive ? "+" : ""}${formatBig(pnl, 2)}
                </TableCell>
                <TableCell
                  className={`text-right ${isPositive ? "text-green-500" : "text-red-500"}`}
                >
                  {isPositive ? "+" : ""}
                  {formatBig(pnlPercent, 2)}%
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
