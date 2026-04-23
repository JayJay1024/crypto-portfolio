import { Big, toBig, safeDivide, clampZero } from "./big"

interface TransactionData {
  type: "BUY" | "SELL"
  quantity: string
  price: string
}

export interface CoinStats {
  coinId: string
  coinSymbol: string
  coinName: string
  totalBuyQty: string
  totalSellQty: string
  remainingHoldings: string
  totalBuyCost: string
  totalSellRevenue: string
  avgBuyPrice: string
  avgSellPrice: string
  costPrice: string
}

export function computeCoinStats(
  coinId: string,
  coinSymbol: string,
  coinName: string,
  transactions: TransactionData[]
): CoinStats {
  let totalBuyQty = new Big(0)
  let totalSellQty = new Big(0)
  let totalBuyCost = new Big(0)
  let totalSellRevenue = new Big(0)

  for (const tx of transactions) {
    const qty = toBig(tx.quantity)
    const price = toBig(tx.price)

    if (tx.type === "BUY") {
      totalBuyQty = totalBuyQty.plus(qty)
      totalBuyCost = totalBuyCost.plus(qty.mul(price))
    } else {
      totalSellQty = totalSellQty.plus(qty)
      totalSellRevenue = totalSellRevenue.plus(qty.mul(price))
    }
  }

  const remainingHoldings = totalBuyQty.minus(totalSellQty)
  const avgBuyPrice = safeDivide(totalBuyCost, totalBuyQty)
  const avgSellPrice = safeDivide(totalSellRevenue, totalSellQty)
  const costPrice = clampZero(
    safeDivide(totalBuyCost.minus(totalSellRevenue), remainingHoldings)
  )

  return {
    coinId,
    coinSymbol,
    coinName,
    totalBuyQty: totalBuyQty.toFixed(),
    totalSellQty: totalSellQty.toFixed(),
    remainingHoldings: remainingHoldings.toFixed(),
    totalBuyCost: totalBuyCost.toFixed(),
    totalSellRevenue: totalSellRevenue.toFixed(),
    avgBuyPrice: avgBuyPrice.toFixed(),
    avgSellPrice: avgSellPrice.toFixed(),
    costPrice: costPrice.toFixed(),
  }
}
