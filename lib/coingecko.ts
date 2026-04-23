export interface CoinSearchResult {
  id: string
  symbol: string
  name: string
  thumb: string
  large: string
}

export interface CoinPrice {
  id: string
  usd: number
  usd_24h_change: number | null
}

interface CacheEntry<T> {
  data: T
  timestamp: number
}

const PRICE_TTL = 60 * 1000
const SEARCH_TTL = 5 * 60 * 1000

const priceCache = new Map<
  string,
  CacheEntry<{ usd: number; usd_24h_change: number | null }>
>()
const searchCache = new Map<string, CacheEntry<CoinSearchResult[]>>()

function getBaseUrl() {
  return process.env.COINGECKO_BASE_URL || "https://api.coingecko.com/api/v3"
}

async function geckoFetch(path: string, params?: Record<string, string>) {
  const url = new URL(`${getBaseUrl()}${path}`)
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value)
    }
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
  }

  const apiKey = process.env.COINGECKO_API_KEY
  if (apiKey) {
    headers["x-cg-demo-api-key"] = apiKey
  }

  const res = await fetch(url.toString(), { headers })
  if (!res.ok) {
    throw new Error(`CoinGecko API error: ${res.status} ${res.statusText}`)
  }
  return res.json()
}

export async function searchCoins(query: string): Promise<CoinSearchResult[]> {
  const cacheKey = query.toLowerCase()
  const cached = searchCache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < SEARCH_TTL) {
    return cached.data
  }

  const data = await geckoFetch("/search", { query })
  const results: CoinSearchResult[] = (data.coins ?? [])
    .slice(0, 20)
    .map((coin: Record<string, string>) => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      thumb: coin.thumb,
      large: coin.large,
    }))

  searchCache.set(cacheKey, { data: results, timestamp: Date.now() })
  return results
}

export async function getCoinPrices(ids: string[]): Promise<CoinPrice[]> {
  const now = Date.now()
  const results: CoinPrice[] = []
  const uncachedIds: string[] = []

  for (const id of ids) {
    const cached = priceCache.get(id)
    if (cached && now - cached.timestamp < PRICE_TTL) {
      results.push({
        id,
        usd: cached.data.usd,
        usd_24h_change: cached.data.usd_24h_change,
      })
    } else {
      uncachedIds.push(id)
    }
  }

  if (uncachedIds.length > 0) {
    const data = await geckoFetch("/simple/price", {
      ids: uncachedIds.join(","),
      vs_currencies: "usd",
      include_24hr_change: "true",
    })

    for (const id of uncachedIds) {
      const coinData = data[id]
      if (coinData) {
        const entry = {
          usd: coinData.usd,
          usd_24h_change: coinData.usd_24h_change ?? null,
        }
        priceCache.set(id, { data: entry, timestamp: now })
        results.push({ id, ...entry })
      }
    }
  }

  return results
}
