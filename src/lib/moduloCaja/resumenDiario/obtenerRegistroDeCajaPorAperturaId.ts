import { DatosExtendidosRegistroCaja } from "@/lib/definitions";
import { fetchPlus } from "@/lib/verificarApiResponse";

export default async function obtenerRegistroDeCajaPorAperturaId(aperturaId: string) {
  const server_url = process.env.URL;
  const url = server_url || "";
  const response = await fetchPlus<DatosExtendidosRegistroCaja>(`${url}/api/registro-caja/apertura/${aperturaId}`, {
    method: "GET",
  });
  return response
}