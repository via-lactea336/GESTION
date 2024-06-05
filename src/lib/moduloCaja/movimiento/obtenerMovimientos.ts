import { Movimiento } from "@prisma/client";
import { ApiResponseData } from "@/lib/definitions";

/**
 * devuelve una lista de movimientos
 */

export async function obtenerMovimientos(): Promise<
  ApiResponseData<Movimiento[]>
> {
  const response = await fetch("/api/caja/movimiento", {
    method: "GET",
  });
  return await response.json();
}
