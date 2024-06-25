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

  if (session.user.rol !== "ADMIN") {
    return redirect("/dashboard/account");
  }

  return children;
}
