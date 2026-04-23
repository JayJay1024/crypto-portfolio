import { NextRequest, NextResponse } from "next/server"
import { getCoinPrices } from "@/lib/coingecko"

export async function GET(request: NextRequest) {
  const idsParam = request.nextUrl.searchParams.get("ids")
  if (!idsParam || idsParam.trim().length < 1) {
    return NextResponse.json(
      { error: "Query parameter 'ids' is required" },
      { status: 400 }
    )
  }

  const ids = idsParam
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)

  if (ids.length === 0) {
    return NextResponse.json(
      { error: "At least one coin ID is required" },
      { status: 400 }
    )
  }

  if (ids.length > 50) {
    return NextResponse.json(
      { error: "Maximum 50 coin IDs allowed per request" },
      { status: 400 }
    )
  }

  try {
    const prices = await getCoinPrices(ids)
    return NextResponse.json(prices)
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch prices" },
      { status: 502 }
    )
  }
}
