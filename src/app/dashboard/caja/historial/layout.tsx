import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import authOptions from "@/lib/auth/options";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default async function layout({ children }: Props) {
  const session = await getServerSession(authOptions);

  if (!session) return redirect("/login");

  if (session.user.rol !== "ADMIN")
    return (
      <h1 className="text-3xl text-red-500 text-center">
        Acceso no autorizado, no eres un adminstrador
      </h1>
    );

  return children;
}
