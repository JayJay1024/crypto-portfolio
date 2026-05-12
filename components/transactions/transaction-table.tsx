"use client"

import { useEffect, useState } from "react"
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useTransactions, useDeleteTransaction } from "@/hooks/use-transactions"
import { useUIStore } from "@/lib/stores/ui-store"
import { getColumns } from "./columns"
import { toast } from "sonner"

export function TransactionTable() {
  const { coinFilter, typeFilter } = useUIStore()
  const [page, setPage] = useState(1)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    setPage(1)
  }, [coinFilter, typeFilter])

  const { data, isLoading } = useTransactions({
    coinId: coinFilter ?? undefined,
    type: typeFilter ?? undefined,
    page,
    limit: 20,
    sort: "date",
    order: "desc",
  })

  const deleteMutation = useDeleteTransaction()
  const openDialog = useUIStore((s) => s.openTransactionDialog)

  const columns = getColumns({
    onEdit: (tx) =>
      openDialog({
        id: tx.id,
        coinId: tx.coinId,
        coinSymbol: tx.coinSymbol,
        coinName: tx.coinName,
        type: tx.type,
        exchange: tx.exchange,
        exchangeCustom: tx.exchangeCustom,
        quantity: tx.quantity,
        price: tx.price,
        date: new Date(tx.date).toISOString().split("T")[0],
        fee: tx.fee,
        feeUnit: tx.feeUnit,
      }),
    onDelete: (id) => setDeleteId(id),
  })

  // TanStack Table's `useReactTable()` isn't memoizable. We don't pass
  // `table` into memoized children, so the compiler's auto-skip is sufficient
  // — the rule is informational only here.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const totalPages = data ? Math.ceil(data.total / data.limit) : 0

  async function handleDelete() {
    if (!deleteId) return
    try {
      await deleteMutation.mutateAsync(deleteId)
      toast.success("Transaction deleted")
    } catch {
      toast.error("Failed to delete transaction")
    }
    setDeleteId(null)
  }

  if (isLoading) {
    return (
      <div className="py-8 text-center text-muted-foreground">Loading...</div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No transactions yet.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages} ({data?.total} records)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Transaction</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this transaction? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
