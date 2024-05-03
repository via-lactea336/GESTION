import { signOut } from "next-auth/react";

export const logout = async () => {
  const response = await signOut({ redirect: false });
  return response;
};
