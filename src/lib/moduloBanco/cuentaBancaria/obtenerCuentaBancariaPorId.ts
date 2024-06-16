import { CuentaBancaria } from "@prisma/client";
import { ApiResponseData } from "../../definitions";

export type CuentaBancariaAndBanco = CuentaBancaria & {
  banco: {
    id: string;
    nombre: string;
  };
}

export default async function obtenerCuentaBancariaPorId(
  id: string
): Promise<ApiResponseData<CuentaBancariaAndBanco> | string | undefined> {
  try {
    const response = await fetch(`/api/cuenta/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data: ApiResponseData<CuentaBancariaAndBanco> = await response.json();

    return data;
  } catch (error) {
    if (error instanceof Error) return error.message;
  }
}
