// types/next-auth.d.ts
import NextAuth from "next-auth";
import { Roles } from "@prisma/client";

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
      rol: Roles
    };
  }

  interface User {
    id: string;
    nombre: string;
    rol: Roles
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    nombre: string;
    rol: Roles
  }
}
