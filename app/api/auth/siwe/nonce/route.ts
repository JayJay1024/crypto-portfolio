import { NextResponse } from "next/server"
import { randomBytes } from "crypto"

export async function GET() {
  const nonce = randomBytes(16).toString("hex")
  const response = NextResponse.json({ nonce })
  response.cookies.set("siwe-nonce", nonce, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 300,
  })
  return response
}
