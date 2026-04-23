import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { getAuthenticatedUser } from "@/lib/api/auth-guard"
import { transactionSchema } from "@/lib/validations/transaction"

export async function GET(request: NextRequest) {
  const { user, error } = await getAuthenticatedUser()
  if (error) return error

  const searchParams = request.nextUrl.searchParams
  const coinId = searchParams.get("coinId")
  const type = searchParams.get("type")
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"))
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("limit") ?? "20"))
  )
  const sort = searchParams.get("sort") ?? "date"
  const order = searchParams.get("order") === "asc" ? "asc" : "desc"

  const where: Prisma.TransactionWhereInput = {
    userId: user!.id,
    ...(coinId && { coinId }),
    ...(type === "BUY" || type === "SELL" ? { type } : {}),
  }

  const allowedSortFields = [
    "date",
    "createdAt",
    "quantity",
    "price",
    "coinName",
  ]
  const sortField = allowedSortFields.includes(sort) ? sort : "date"

  const [data, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: { [sortField]: order },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.transaction.count({ where }),
  ])

  const serialized = data.map((tx) => ({
    ...tx,
    quantity: tx.quantity.toString(),
    price: tx.price.toString(),
    fee: tx.fee.toString(),
  }))

  return NextResponse.json({ data: serialized, total, page, limit })
}

export async function POST(request: NextRequest) {
  const { user, error } = await getAuthenticatedUser()
  if (error) return error

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = transactionSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.issues },
      { status: 400 }
    )
  }

  const input = parsed.data
  const tx = await prisma.transaction.create({
    data: {
      userId: user!.id,
      coinId: input.coinId,
      coinSymbol: input.coinSymbol,
      coinName: input.coinName,
      type: input.type,
      exchange: input.exchange,
      exchangeCustom: input.exchange === "CUSTOM" ? input.exchangeCustom : null,
      quantity: new Prisma.Decimal(input.quantity),
      price: new Prisma.Decimal(input.price),
      date: new Date(input.date),
      fee: new Prisma.Decimal(input.fee),
      feeUnit: input.feeUnit,
    },
  })

  return NextResponse.json(
    {
      data: {
        ...tx,
        quantity: tx.quantity.toString(),
        price: tx.price.toString(),
        fee: tx.fee.toString(),
      },
    },
    { status: 201 }
  )
}
