"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useUIStore } from "@/lib/stores/ui-store"
import { TransactionForm } from "./transaction-form"

export function TransactionDialog() {
  const { transactionDialogOpen, editingTransaction, closeTransactionDialog } =
    useUIStore()

  const defaultValues = editingTransaction
    ? {
        id: editingTransaction.id,
        coinId: editingTransaction.coinId,
        coinSymbol: editingTransaction.coinSymbol,
        coinName: editingTransaction.coinName,
        type: editingTransaction.type,
        exchange: editingTransaction.exchange,
        exchangeCustom: editingTransaction.exchangeCustom ?? "",
        quantity: editingTransaction.quantity,
        price: editingTransaction.price,
        date: editingTransaction.date,
        fee: editingTransaction.fee,
        feeUnit: editingTransaction.feeUnit,
      }
    : undefined

  return (
    <Dialog open={transactionDialogOpen} onOpenChange={closeTransactionDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingTransaction ? "Edit Transaction" : "New Transaction"}
          </DialogTitle>
        </DialogHeader>
        {transactionDialogOpen && (
          <TransactionForm
            key={editingTransaction?.id ?? "new"}
            defaultValues={defaultValues}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
