import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/libs/prisma"
import bcrypt from "bcrypt"

const LOGIN_URL = process.env.LOGIN_URL || "/auth/login"

const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", },
        password: {  label: "Password", type: "password" },
      },
      async authorize(credentials, _req) {
        
        // Add logic here to look up the user
        if (!credentials?.username || !credentials?.password) throw new Error("Email and password are required")
        
        // Check if user exists
        const user = await prisma.user.findUnique({where: {username: credentials.username}})
        if(!user) throw new Error("Username or password is incorrect")

        // Check if password is correct
        const match = await bcrypt.compare(credentials.password, user.password)
        if(!match) throw new Error("Username or password is incorrect")

        // If everything is correct, return the session
        return{
          id: user.id,
          username:user.username
        }
      }
  })
  ],

  pages: {
      signIn:LOGIN_URL,
      signOut:"/",
      error:LOGIN_URL,
  }
}

export default authOptions