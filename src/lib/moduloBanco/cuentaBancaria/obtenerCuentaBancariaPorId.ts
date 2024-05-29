import { CuentaBancaria } from "@prisma/client";
import { ApiResponseData } from "../../definitions";

export default async function obtenerCuentaBancariaPorId(
  id: string
): Promise<ApiResponseData<CuentaBancaria> | string | undefined> {
  try {
    const response = await fetch(`/api/cuenta/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data: ApiResponseData<CuentaBancaria> = await response.json();

    return data;
  } catch (error) {
    if (error instanceof Error) return error.message;
  }
}
