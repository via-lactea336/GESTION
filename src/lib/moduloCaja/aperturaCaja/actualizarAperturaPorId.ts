import { AperturaCaja } from "@prisma/client";
import { fetchPlus } from "../../verificarApiResponse";

/**
 * Permite actualizar una apertura de caja
 * @returns la apertura de caja actualizada
 */

export default async function actualizarAperturaPorId({
  id,
  cajaId,
  cajeroId,
  apertura,
  saldoInicial,
}: AperturaCaja) {
  const server_url = process.env.URL;
  const url = server_url || "";

  //Return { success, data?, message?, error? }
  return await fetchPlus(`${url}/api/apertura-caja/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cajaId,
        cajeroId,
        apertura,
        saldoInicial,
      }),
  })
}
