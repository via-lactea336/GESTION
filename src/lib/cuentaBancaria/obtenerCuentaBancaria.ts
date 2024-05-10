import { ApiResponseData } from "../definitions";
import { CuentaBancariaAndBanco } from "../definitions";

export default async function obtenerCuentaBancaria(): Promise<
  ApiResponseData<CuentaBancariaAndBanco[]> | string | undefined
> {
  try {
    const response = await fetch("/api/cuenta", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data: ApiResponseData<CuentaBancariaAndBanco[]> = await response.json();

    return data;
  } catch (error) {
    if (error instanceof Error) return error.message;
  }
}
