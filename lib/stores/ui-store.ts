import { create } from "zustand"

interface UIState {
  transactionDialogOpen: boolean
  editingTransaction: null | {
    id: string
    coinId: string
    coinSymbol: string
    coinName: string
    type: "BUY" | "SELL"
    exchange: "BINANCE" | "OKX" | "GATE" | "BITGET" | "HYPER" | "CUSTOM"
    exchangeCustom: string | null
    quantity: string
    price: string
    date: string
    fee: string
    feeUnit: "USDT" | "CRYPTO"
  }
  openTransactionDialog: (tx?: UIState["editingTransaction"]) => void
  closeTransactionDialog: () => void

  coinFilter: string | null
  typeFilter: "BUY" | "SELL" | null
  setCoinFilter: (coinId: string | null) => void
  setTypeFilter: (type: "BUY" | "SELL" | null) => void
}

export const useUIStore = create<UIState>((set) => ({
  transactionDialogOpen: false,
  editingTransaction: null,
  openTransactionDialog: (tx) =>
    set({ transactionDialogOpen: true, editingTransaction: tx ?? null }),
  closeTransactionDialog: () =>
    set({ transactionDialogOpen: false, editingTransaction: null }),

  coinFilter: null,
  typeFilter: null,
  setCoinFilter: (coinId) => set({ coinFilter: coinId }),
  setTypeFilter: (type) => set({ typeFilter: type }),
}))
