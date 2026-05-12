import type { Metadata, Viewport } from "next"
import { Geist_Mono, Inter } from "next/font/google"
import Script from "next/script"
import { GoogleAnalytics } from "@next/third-parties/google"

import "./globals.css"
import { ConsentBanner } from "@/components/consent-banner"
import { ThemeProvider } from "@/components/theme-provider"
import { ProvidersWrapper } from "@/components/providers-wrapper"
import { cn } from "@/lib/utils"

const gaId = process.env.NEXT_PUBLIC_GA_ID

const consentDefault = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'analytics_storage': 'denied',
  'wait_for_update': 500
});`

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.AUTH_URL ?? "http://localhost:3000"),
  title: {
    default: "Crypto Portfolio",
    template: "%s · Crypto Portfolio",
  },
  description:
    "Self-hosted crypto portfolio tracker with live valuation, allocation, and per-coin PnL.",
  applicationName: "Crypto Portfolio",
  manifest: "/manifest.webmanifest",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body>
        <ThemeProvider>
          <ProvidersWrapper>{children}</ProvidersWrapper>
          {gaId && <ConsentBanner />}
        </ThemeProvider>
      </body>
      {gaId && (
        <>
          <Script id="ga-consent-default" strategy="beforeInteractive">
            {consentDefault}
          </Script>
          <GoogleAnalytics gaId={gaId} />
        </>
      )}
    </html>
  )
}
