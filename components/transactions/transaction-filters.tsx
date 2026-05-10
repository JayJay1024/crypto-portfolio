"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useUIStore } from "@/lib/stores/ui-store"
import { usePortfolioStats } from "@/hooks/use-portfolio-stats"

const ALL_VALUE = "__all__"

export function TransactionFilters() {
  const { coinFilter, typeFilter, setCoinFilter, setTypeFilter } = useUIStore()
  const { data: stats } = usePortfolioStats()
  const [open, setOpen] = useState(false)

  const coins = stats?.coins ?? []
  const selected = coins.find((c) => c.coinId === coinFilter)

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-48 justify-between"
          >
            {selected ? (
              <span className="truncate">
                {selected.coinSymbol.toUpperCase()}
                <span className="text-muted-foreground">
                  {" "}
                  · {selected.coinName}
                </span>
              </span>
            ) : (
              <span className="text-muted-foreground">All Coins</span>
            )}
            <ChevronsUpDown className="size-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0" align="start">
          <Command>
            <CommandInput placeholder="Search coin..." />
            <CommandList>
              <CommandEmpty>No coin found.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  value={ALL_VALUE}
                  onSelect={() => {
                    setCoinFilter(null)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "size-4",
                      coinFilter === null ? "opacity-100" : "opacity-0"
                    )}
                  />
                  All Coins
                </CommandItem>
                {coins.map((coin) => (
                  <CommandItem
                    key={coin.coinId}
                    value={`${coin.coinSymbol} ${coin.coinName} ${coin.coinId}`}
                    onSelect={() => {
                      setCoinFilter(coin.coinId)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "size-4",
                        coinFilter === coin.coinId
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    <span className="font-medium">
                      {coin.coinSymbol.toUpperCase()}
                    </span>
                    <span className="text-muted-foreground">
                      {coin.coinName}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Select
        value={typeFilter ?? ALL_VALUE}
        onValueChange={(v) =>
          setTypeFilter(v === ALL_VALUE ? null : (v as "BUY" | "SELL"))
        }
      >
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>All Types</SelectItem>
          <SelectItem value="BUY">Buy</SelectItem>
          <SelectItem value="SELL">Sell</SelectItem>
        </SelectContent>
      </Select>

      {(coinFilter || typeFilter) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setCoinFilter(null)
            setTypeFilter(null)
          }}
        >
          Clear
        </Button>
      )}
    </div>
  )
}
