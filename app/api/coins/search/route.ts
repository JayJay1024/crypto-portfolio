import { NextRequest, NextResponse } from "next/server"
import { searchCoins } from "@/lib/coingecko"

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")
  if (!q || q.trim().length < 1) {
    return NextResponse.json(
      { error: "Query parameter 'q' is required" },
      { status: 400 }
    )
  }

  try {
    const results = await searchCoins(q.trim())
    return NextResponse.json(results)
  } catch {
    return NextResponse.json(
      { error: "Failed to search coins" },
      { status: 502 }
    )
  }
}
