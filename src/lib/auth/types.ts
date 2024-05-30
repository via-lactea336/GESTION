// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's ID. */
      id: string;
      /** The user's name. */
      nombre: string;
    };
  }

  interface User {
    id: string;
    nombre: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    nombre: string;
  }
}
