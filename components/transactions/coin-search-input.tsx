"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { ChevronsUpDown } from "lucide-react"
import { useCoinSearch } from "@/hooks/use-coin-search"

interface CoinSearchInputProps {
  value: { coinId: string; coinSymbol: string; coinName: string } | null
  onSelect: (coin: {
    coinId: string
    coinSymbol: string
    coinName: string
  }) => void
}

export function CoinSearchInput({ value, onSelect }: CoinSearchInputProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const { data: results, isLoading } = useCoinSearch(query)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          {value ? (
            <span className="truncate">
              {value.coinName} ({value.coinSymbol.toUpperCase()})
            </span>
          ) : (
            <span className="text-muted-foreground">
              Search cryptocurrency...
            </span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search coins..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>
              {isLoading ? "Searching..." : "No coins found."}
            </CommandEmpty>
            <CommandGroup>
              {results?.map((coin) => (
                <CommandItem
                  key={coin.id}
                  value={coin.id}
                  onSelect={() => {
                    onSelect({
                      coinId: coin.id,
                      coinSymbol: coin.symbol,
                      coinName: coin.name,
                    })
                    setOpen(false)
                    setQuery("")
                  }}
                >
                  <Image
                    src={coin.thumb}
                    alt={coin.name}
                    width={20}
                    height={20}
                    className="mr-2 rounded-full"
                    unoptimized
                  />
                  <span className="truncate">{coin.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {coin.symbol.toUpperCase()}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
