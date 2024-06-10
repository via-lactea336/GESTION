import { Movimiento } from "@prisma/client";
import { ApiResponseData } from "@/lib/definitions";

/**
 * devuelve una lista de movimientos
 */

export async function obtenerMovimientos(): Promise<
  ApiResponseData<Movimiento[]>
> {
  const server_url = process.env.URL;
  const url = server_url || "";
  const response = await fetch(`${url}/api/movimiento`, {
    method: "GET",
  });
  return await response.json();
}
