"use client"

import dynamic from "next/dynamic"

const Providers = dynamic(
  () => import("@/components/providers").then((mod) => mod.Providers),
  { ssr: false }
)

export function ProvidersWrapper({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>
}
