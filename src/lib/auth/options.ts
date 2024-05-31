import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

const LOGIN_URL = process.env.LOGIN_URL || "/auth/login";

const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, _req) {
        // Add logic here to look up the user
        if (!credentials?.username || !credentials?.password)
          throw new Error("Email and password are required");

        // Check if user exists
        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        });
        if (!user) throw new Error("Username or password is incorrect");

        // Check if password is correct
        const match = await bcrypt.compare(credentials.password, user.password);
        if (!match) throw new Error("Username or password is incorrect");

        // If everything is correct, return the session
        return {
          id: user.id,
          username:user.username,
          nombre:user.nombre + " " + user.apellido,
        }
      },
  })
  ],
  callbacks: {
    async jwt(params) {
      const {token, user} = params
      if(user) {
        token.nombre = user.nombre
        token.id = user.id
      }
      return token
    }, 
    async session(params) {
      const {token, session} = params
      if (token) {
        session.user.id = token.id;
        session.user.nombre = token.nombre;
      }
      return session
    },
  },
  pages: {
    signIn: LOGIN_URL,
    signOut: "/",
    error: LOGIN_URL,
  },
};

export default authOptions;
