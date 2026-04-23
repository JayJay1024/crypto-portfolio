import { z } from "zod/v4"

const positiveNumberString = z
  .string()
  .min(1)
  .check(
    z.refine((v) => !isNaN(Number(v)) && Number(v) > 0, {
      message: "Must be a positive number",
    })
  )

const nonNegativeNumberString = z.string().check(
  z.refine((v) => !isNaN(Number(v)) && Number(v) >= 0, {
    message: "Must be a non-negative number",
  })
)

export const transactionSchema = z
  .object({
    coinId: z.string().min(1),
    coinSymbol: z.string().min(1),
    coinName: z.string().min(1),
    type: z.enum(["BUY", "SELL"]),
    exchange: z.enum(["BINANCE", "OKX", "GATE", "BITGET", "CUSTOM"]),
    exchangeCustom: z.string().optional(),
    quantity: positiveNumberString,
    price: positiveNumberString,
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    fee: nonNegativeNumberString.default("0"),
    feeUnit: z.enum(["USDT", "CRYPTO"]),
  })
  .check(
    z.refine(
      (data) => {
        if (data.exchange === "CUSTOM") {
          return data.exchangeCustom && data.exchangeCustom.trim().length > 0
        }
        return true
      },
      {
        message: "Custom exchange name is required",
        path: ["exchangeCustom"],
      }
    )
  )

export type TransactionInput = z.infer<typeof transactionSchema>
