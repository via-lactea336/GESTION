import { RegistroCaja } from "@prisma/client";
import { ApiResponseData } from "@/lib/definitions";

/**
 * devuelve una lista de registros de caja
 */

export async function obtenerRegistrosCaja(): Promise<
  ApiResponseData<RegistroCaja[]>
> {
  const response = await fetch("/api/caja/registro-caja", {
    method: "GET",
  });
  return await response.json();
}
