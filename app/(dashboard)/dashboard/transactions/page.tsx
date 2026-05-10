"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TransactionTable } from "@/components/transactions/transaction-table"
import { TransactionDialog } from "@/components/transactions/transaction-dialog"
import { useUIStore } from "@/lib/stores/ui-store"

export default function TransactionsPage() {
  const openDialog = useUIStore((s) => s.openTransactionDialog)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <Button onClick={() => openDialog()}>
          <Plus className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Add Transaction</span>
        </Button>
      </div>
      <div className="mt-6">
        <TransactionTable />
      </div>
      <TransactionDialog />
    </div>
  )
}
