import type { Metadata } from "next"
import { WalletButton } from "@/components/layout/wallet-button"

export const metadata: Metadata = {
  title: "Sign in",
  description: "Connect your wallet to access your portfolio.",
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Crypto Portfolio
          </h1>
          <p className="mt-2 text-muted-foreground">
            Connect your wallet to get started
          </p>
        </div>
        <WalletButton size="lg" className="px-6 text-base" />
      </div>
    </div>
  )
}
