import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { getAuthenticatedUser } from "@/lib/api/auth-guard"
import { transactionSchema } from "@/lib/validations/transaction"

type Params = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, { params }: Params) {
  const { user, error } = await getAuthenticatedUser()
  if (error) return error

  const { id } = await params
  const tx = await prisma.transaction.findFirst({
    where: { id, userId: user!.id },
  })

  if (!tx) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json({
    data: {
      ...tx,
      quantity: tx.quantity.toString(),
      price: tx.price.toString(),
      fee: tx.fee.toString(),
    },
  })
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { user, error } = await getAuthenticatedUser()
  if (error) return error

  const { id } = await params
  const existing = await prisma.transaction.findFirst({
    where: { id, userId: user!.id },
  })

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

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
  const tx = await prisma.transaction.update({
    where: { id },
    data: {
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

  return NextResponse.json({
    data: {
      ...tx,
      quantity: tx.quantity.toString(),
      price: tx.price.toString(),
      fee: tx.fee.toString(),
    },
  })
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { user, error } = await getAuthenticatedUser()
  if (error) return error

  const { id } = await params
  const existing = await prisma.transaction.findFirst({
    where: { id, userId: user!.id },
  })

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  await prisma.transaction.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
