import { Operacion } from "@prisma/client";
import { ApiResponseData } from "../../definitions";

export default async function obtenerOperaciones(): Promise<
  ApiResponseData<Operacion[]> | string | undefined
> {
  try {
    const response = await fetch("/api/operacion", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data: ApiResponseData<Operacion[]> = await response.json();

    return data;
  } catch (error) {
    if (error instanceof Error) return error.message;
  }
}
