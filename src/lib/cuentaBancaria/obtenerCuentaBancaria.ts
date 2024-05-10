import { CuentaBancaria } from "@prisma/client";
import { ApiResponseData } from "../definitions";

export default async function obtenerCuentaBancaria(): Promise<
  ApiResponseData<CuentaBancaria[]> | string | undefined
> {
  try {
    const response = await fetch("/api/cuenta", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data: ApiResponseData<CuentaBancaria[]> = await response.json();

    return data;
  } catch (error) {
    if (error instanceof Error) return error.message;
  }
}
