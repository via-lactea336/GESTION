import { RegistroDiarioFullData } from "@/lib/definitions";
import { fetchPlus } from "@/lib/verificarApiResponse";

/**
 * Devuelve un registro-caja mediante el ID
 * @param param0 El id del registro de la caja
 * @returns Un registro-caja mediante el ID
 */
export async function obtenerRegistroCajaPorId({id}: {id:string}) {
  const server_url = process.env.URL;
  const url = server_url || "";
  const response = await fetchPlus<RegistroDiarioFullData>(`${url}/api/registro-caja/${id}`, {
    method: "GET",
  });
  return response
}
