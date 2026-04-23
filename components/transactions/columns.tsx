"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { Big, toBig, formatBig } from "@/lib/big"
import type { TransactionRecord } from "@/hooks/use-transactions"

interface ColumnActions {
  onEdit: (tx: TransactionRecord) => void
  onDelete: (id: string) => void
}

export function getColumns(
  actions: ColumnActions
): ColumnDef<TransactionRecord>[] {
  return [
    {
      accessorKey: "coinName",
      header: "Coin",
      cell: ({ row }) => (
        <div>
          <span className="font-medium">{row.original.coinName}</span>
          <span className="ml-1 text-xs text-muted-foreground">
            {row.original.coinSymbol.toUpperCase()}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <Badge
          variant={row.original.type === "BUY" ? "default" : "destructive"}
        >
          {row.original.type}
        </Badge>
      ),
    },
    {
      accessorKey: "exchange",
      header: "Exchange",
      cell: ({ row }) =>
        row.original.exchange === "CUSTOM"
          ? row.original.exchangeCustom
          : row.original.exchange,
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ row }) => formatBig(toBig(row.original.quantity), 8),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => `$${formatBig(toBig(row.original.price), 2)}`,
    },
    {
      id: "total",
      header: "Total",
      cell: ({ row }) => {
        const total = toBig(row.original.quantity).mul(
          toBig(row.original.price)
        )
        return `$${formatBig(total, 2)}`
      },
    },
    {
      accessorKey: "fee",
      header: "Fee",
      cell: ({ row }) => {
        const fee = toBig(row.original.fee)
        if (fee.eq(new Big(0))) return "-"
        return `${formatBig(fee, 8)} ${row.original.feeUnit}`
      },
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        const date = new Date(row.original.date)
        return date.toISOString().split("T")[0]
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-xs">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => actions.onEdit(row.original)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => actions.onDelete(row.original.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]
}
