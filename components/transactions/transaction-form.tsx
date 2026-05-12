"use client"

import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import {
  transactionSchema,
  type TransactionInput,
} from "@/lib/validations/transaction"
import { CoinSearchInput } from "./coin-search-input"
import { ExchangeSelect } from "./exchange-select"
import {
  useCreateTransaction,
  useUpdateTransaction,
} from "@/hooks/use-transactions"
import { useUIStore } from "@/lib/stores/ui-store"
import { toast } from "sonner"

interface TransactionFormProps {
  defaultValues?: TransactionInput & { id?: string }
}

export function TransactionForm({ defaultValues }: TransactionFormProps) {
  const closeDialog = useUIStore((s) => s.closeTransactionDialog)
  const createMutation = useCreateTransaction()
  const updateMutation = useUpdateTransaction()
  const isEditing = !!defaultValues?.id

  const form = useForm<TransactionInput>({
    resolver: zodResolver(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transactionSchema as any
    ) as Resolver<TransactionInput>,
    defaultValues: defaultValues ?? {
      coinId: "",
      coinSymbol: "",
      coinName: "",
      type: "BUY",
      exchange: "BINANCE",
      exchangeCustom: "",
      quantity: "",
      price: "",
      date: format(new Date(), "yyyy-MM-dd"),
      fee: "0",
      feeUnit: "USDT",
    },
  })

  // React Hook Form's `watch()` isn't memoizable. We don't pass these values
  // into memoized children, so the compiler's auto-skip is sufficient — the
  // rule is informational only here.
  // eslint-disable-next-line react-hooks/incompatible-library
  const watchType = form.watch("type")
  const watchExchange = form.watch("exchange")
  const watchFeeUnit = form.watch("feeUnit")
  const watchDate = form.watch("date")
  const coinValue = form.watch("coinId")
    ? {
        coinId: form.watch("coinId"),
        coinSymbol: form.watch("coinSymbol"),
        coinName: form.watch("coinName"),
      }
    : null

  async function onSubmit(data: TransactionInput) {
    try {
      if (isEditing && defaultValues?.id) {
        await updateMutation.mutateAsync({
          id: defaultValues.id,
          input: data,
        })
        toast.success("Transaction updated")
      } else {
        await createMutation.mutateAsync(data)
        toast.success("Transaction created")
      }
      closeDialog()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex gap-2">
        <Button
          type="button"
          variant={watchType === "BUY" ? "default" : "outline"}
          className="flex-1"
          onClick={() => form.setValue("type", "BUY")}
        >
          Buy
        </Button>
        <Button
          type="button"
          variant={watchType === "SELL" ? "destructive" : "outline"}
          className="flex-1"
          onClick={() => form.setValue("type", "SELL")}
        >
          Sell
        </Button>
      </div>

      <div className="space-y-2">
        <Label>Cryptocurrency</Label>
        <CoinSearchInput
          value={coinValue}
          onSelect={(coin) => {
            form.setValue("coinId", coin.coinId)
            form.setValue("coinSymbol", coin.coinSymbol)
            form.setValue("coinName", coin.coinName)
          }}
        />
        {form.formState.errors.coinId && (
          <p className="text-sm text-destructive">
            {form.formState.errors.coinId.message ??
              "Cryptocurrency is required"}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Exchange</Label>
        <ExchangeSelect
          value={watchExchange}
          onValueChange={(v) =>
            form.setValue("exchange", v as TransactionInput["exchange"])
          }
        />
      </div>

      {watchExchange === "CUSTOM" && (
        <div className="space-y-2">
          <Label>Custom Exchange Name</Label>
          <Input
            placeholder="Enter exchange name"
            {...form.register("exchangeCustom")}
          />
          {form.formState.errors.exchangeCustom && (
            <p className="text-sm text-destructive">
              {form.formState.errors.exchangeCustom.message}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Quantity</Label>
          <Input
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            {...form.register("quantity")}
          />
          {form.formState.errors.quantity && (
            <p className="text-sm text-destructive">
              {form.formState.errors.quantity.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Price (USDT)</Label>
          <Input
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            {...form.register("price")}
          />
          {form.formState.errors.price && (
            <p className="text-sm text-destructive">
              {form.formState.errors.price.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !watchDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {watchDate || "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={
                watchDate ? new Date(watchDate + "T00:00:00") : undefined
              }
              onSelect={(date) => {
                if (date) form.setValue("date", format(date, "yyyy-MM-dd"))
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Fee</Label>
          <Input
            type="text"
            inputMode="decimal"
            placeholder="0"
            {...form.register("fee")}
          />
          {form.formState.errors.fee && (
            <p className="text-sm text-destructive">
              {form.formState.errors.fee.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Fee Unit</Label>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant={watchFeeUnit === "USDT" ? "default" : "outline"}
              className="flex-1"
              onClick={() => form.setValue("feeUnit", "USDT")}
            >
              USDT
            </Button>
            <Button
              type="button"
              size="sm"
              variant={watchFeeUnit === "CRYPTO" ? "default" : "outline"}
              className="flex-1"
              onClick={() => form.setValue("feeUnit", "CRYPTO")}
            >
              Crypto
            </Button>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending
          ? "Saving..."
          : isEditing
            ? "Update Transaction"
            : "Add Transaction"}
      </Button>
    </form>
  )
}
