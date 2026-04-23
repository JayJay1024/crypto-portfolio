"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SessionProvider, signIn, signOut } from "next-auth/react"
import {
  RainbowKitAuthenticationProvider,
  RainbowKitProvider,
  createAuthenticationAdapter,
  darkTheme,
  lightTheme,
} from "@rainbow-me/rainbowkit"
import { useTheme } from "next-themes"
import { usePathname, useRouter } from "next/navigation"
import { createSiweMessage } from "viem/siwe"
import { config } from "@/lib/wagmi"
import { useSession } from "next-auth/react"

import "@rainbow-me/rainbowkit/styles.css"

function RainbowKitWithAuth({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme()
  const { status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const prevStatus = useRef(status)

  useEffect(() => {
    if (prevStatus.current === status) return
    prevStatus.current = status

    if (status === "authenticated" && pathname === "/login") {
      router.replace("/dashboard")
    }
    if (status === "unauthenticated" && pathname.startsWith("/dashboard")) {
      router.replace("/login")
    }
  }, [status, pathname, router])

  const authAdapter = useMemo(
    () =>
      createAuthenticationAdapter({
        getNonce: async () => {
          const res = await fetch("/api/auth/siwe/nonce")
          const data = await res.json()
          return data.nonce
        },
        createMessage: ({ nonce, address, chainId }) => {
          return createSiweMessage({
            domain: window.location.host,
            address,
            statement: "Sign in to Crypto Portfolio",
            uri: window.location.origin,
            version: "1",
            chainId,
            nonce,
          })
        },
        verify: async ({ message, signature }) => {
          const res = await signIn("credentials", {
            message: JSON.stringify(message),
            signature,
            redirect: false,
          })
          return res?.ok ?? false
        },
        signOut: async () => {
          await signOut({ redirect: false })
        },
      }),
    []
  )

  const authStatus =
    status === "loading"
      ? "loading"
      : status === "authenticated"
        ? "authenticated"
        : "unauthenticated"

  return (
    <RainbowKitAuthenticationProvider adapter={authAdapter} status={authStatus}>
      <RainbowKitProvider
        theme={resolvedTheme === "dark" ? darkTheme() : lightTheme()}
      >
        {children}
      </RainbowKitProvider>
    </RainbowKitAuthenticationProvider>
  )
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <RainbowKitWithAuth>{children}</RainbowKitWithAuth>
        </SessionProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
