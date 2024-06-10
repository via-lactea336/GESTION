import { fetchPlus } from "@/lib/verificarApiResponse";
import { Recibos } from "@prisma/client";

/**
 * Obtiene un recibo por su id
 */

export default async function obtenerReciboPorId(id: string) {
  const server_url = process.env.URL;
  const url = server_url || "";
  return await fetchPlus(`${url}/api/recibo/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  });
}
