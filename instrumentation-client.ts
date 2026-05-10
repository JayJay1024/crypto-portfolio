// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs"

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN

if (dsn) {
  Sentry.init({
    dsn,

    integrations: [
      // Wallet addresses, balances, and SIWE messages may render in DOM —
      // mask all text and block media to keep replays free of on-chain PII
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],

    tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    enableLogs: true,

    sendDefaultPii: false,

    // wagmi/RainbowKit surface user-cancelled wallet prompts as thrown errors;
    // they are expected UX, not bugs
    ignoreErrors: [
      "UserRejectedRequestError",
      "User rejected the request",
      "User denied transaction signature",
      "User rejected transaction",
      "ConnectorNotFoundError",
    ],
  })
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
