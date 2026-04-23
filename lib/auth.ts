import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { SiweMessage } from "siwe"
import { prisma } from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Arbitrum",
      credentials: {
        message: { label: "Message", type: "text" },
        signature: { label: "Signature", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.message || !credentials?.signature) return null

        try {
          const siwe = new SiweMessage(
            JSON.parse(credentials.message as string)
          )
          const result = await siwe.verify({
            signature: credentials.signature as string,
          })

          if (!result.success) return null

          const address = siwe.address.toLowerCase()
          const user = await prisma.user.upsert({
            where: { walletAddress: address },
            update: {},
            create: { walletAddress: address },
          })

          return {
            id: user.id,
            name: user.walletAddress,
          }
        } catch {
          return null
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
        token.walletAddress = user.name
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string
        session.user.walletAddress = token.walletAddress as string
      }
      return session
    },
  },
})
