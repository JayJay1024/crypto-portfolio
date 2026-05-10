"use client"

import { ConnectButton } from "@rainbow-me/rainbowkit"
import { ChevronDown } from "lucide-react"
import type { VariantProps } from "class-variance-authority"

import { Button, buttonVariants } from "@/components/ui/button"

type WalletButtonProps = {
  size?: VariantProps<typeof buttonVariants>["size"]
  className?: string
}

export function WalletButton({ size, className }: WalletButtonProps = {}) {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading"
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated")

        return (
          <div
            aria-hidden={!ready}
            className={!ready ? "pointer-events-none select-none opacity-0" : ""}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    size={size}
                    className={className}
                    onClick={openConnectModal}
                  >
                    Connect Wallet
                  </Button>
                )
              }

              if (chain.unsupported) {
                return (
                  <Button
                    variant="destructive"
                    size={size}
                    className={className}
                    onClick={openChainModal}
                  >
                    Wrong network
                  </Button>
                )
              }

              return (
                <Button
                  variant="outline"
                  size={size}
                  className={className}
                  onClick={openAccountModal}
                >
                  {account.displayName}
                  <ChevronDown className="size-3.5 opacity-60" />
                </Button>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}
