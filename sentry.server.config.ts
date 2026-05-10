// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: "https://b5b7a92bdd727e45af2829dbb32d14ad@o4511365478678528.ingest.us.sentry.io/4511365583077376",

  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,

  includeLocalVariables: true,

  enableLogs: true,

  sendDefaultPii: false,

  beforeSend(event, hint) {
    const error = hint.originalException

    // CoinGecko proxy hits 429 under load — upstream throttle, not a bug
    if (
      error &&
      typeof error === "object" &&
      "status" in error &&
      (error as { status?: number }).status === 429
    ) {
      return null
    }

    return event
  },
})
