import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import NextAuth from "next-auth"
import Resend from "next-auth/providers/resend"

const prisma = new PrismaClient()

const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Resend({
      apiKey: process.env.RESEND_API_KEY!,
      from: "Hermes Launch Lab <no-reply@tonysimons.dev>"
    })
  ],
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify"
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        // @ts-ignore
        session.user.role = user.role || 'customer'
      }
      return session
    }
  }
})

export const { GET, POST } = handlers
