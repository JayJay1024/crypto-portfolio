import { auth } from "@/lib/auth"

export async function getSession() {
  const session = await auth()
  if (!session?.user?.id || !session?.user?.walletAddress) return null
  return session
}
