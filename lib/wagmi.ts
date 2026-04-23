import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { arbitrum } from "wagmi/chains"
import { http } from "wagmi"

export const config = getDefaultConfig({
  appName: "Crypto Portfolio",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "",
  chains: [arbitrum],
  transports: {
    [arbitrum.id]: http(),
  },
  ssr: true,
})
