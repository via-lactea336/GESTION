import { fetchPlus } from "@/lib/verificarApiResponse";

export type CrearReciboType = {
  clienteId: string,
  facturaId: string,
  totalPagado: number,
  movimientoId: string
}

export default async function crearRecibo({
  clienteId,
  facturaId,
  totalPagado,
  movimientoId
}: CrearReciboType ) {
  const server_url = process.env.URL;
  const url = server_url || "";
  return await fetchPlus(`${url}/api/recibo`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      clienteId,
      facturaId,
      totalPagado,
      movimientoId
    }),
  })
}