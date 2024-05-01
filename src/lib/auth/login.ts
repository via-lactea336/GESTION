import { signIn } from "next-auth/react";

export const login = async (credentials: {
  username: string;
  password: string;
}) => {
  const userData = {
    username: credentials.username,
    password: credentials.password,
  };
  const response = await signIn("credentials", {
    ...userData,
    redirect: false,
  });
  return !!response?.error;
};
