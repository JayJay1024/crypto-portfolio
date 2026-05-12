"use client"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"

const STORAGE_KEY = "ga-consent-v1"

type ConsentChoice = "granted" | "denied"

// Mirrors @next/third-parties' inline gtag helper: pushes the IArguments
// object rather than a plain Array, which is the contract gtag.js documents
// and what the package's own `sendGAEvent` does. Params exist only for the
// TypeScript signature — the body reads `arguments` directly.
function gtag(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _command: "consent",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _action: "update",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _signals: Record<string, ConsentChoice>
) {
  window.dataLayer = window.dataLayer ?? []
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments)
}

function updateConsent(choice: ConsentChoice) {
  gtag("consent", "update", {
    ad_storage: choice,
    ad_user_data: choice,
    ad_personalization: choice,
    analytics_storage: choice,
  })
}

export function ConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let stored: ConsentChoice | null
    try {
      stored = localStorage.getItem(STORAGE_KEY) as ConsentChoice | null
    } catch {
      // Storage blocked (Safari private mode, locked-down privacy contexts).
      // Keep consent denied and the banner hidden — we can't persist a choice.
      return
    }
    if (stored === "granted") {
      updateConsent("granted")
    } else if (stored === null) {
      // Mount-detection: banner visibility depends on client-only storage,
      // so we must read it after hydration and set state accordingly.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true)
    }
  }, [])

  if (!visible) return null

  const choose = (choice: ConsentChoice) => {
    updateConsent(choice)
    try {
      localStorage.setItem(STORAGE_KEY, choice)
    } catch {
      // Storage blocked — choice still applies for this session.
    }
    setVisible(false)
  }

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed inset-x-2 bottom-2 z-50 mx-auto max-w-2xl rounded-lg border bg-background/95 p-4 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:inset-x-4 sm:bottom-4"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          We use Google Analytics cookies to understand how the app is used. No
          personal data is shared.
        </p>
        <div className="flex shrink-0 gap-2">
          <Button variant="ghost" size="sm" onClick={() => choose("denied")}>
            Reject
          </Button>
          <Button size="sm" onClick={() => choose("granted")}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  )
}
