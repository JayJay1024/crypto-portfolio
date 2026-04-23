"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const EXCHANGES = [
  { value: "BINANCE", label: "Binance" },
  { value: "OKX", label: "OKX" },
  { value: "GATE", label: "Gate" },
  { value: "BITGET", label: "Bitget" },
  { value: "CUSTOM", label: "Custom" },
] as const

interface ExchangeSelectProps {
  value: string
  onValueChange: (value: string) => void
}

export function ExchangeSelect({ value, onValueChange }: ExchangeSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select exchange" />
      </SelectTrigger>
      <SelectContent>
        {EXCHANGES.map((exchange) => (
          <SelectItem key={exchange.value} value={exchange.value}>
            {exchange.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
