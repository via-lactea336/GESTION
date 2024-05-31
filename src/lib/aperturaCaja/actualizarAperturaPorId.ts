import { AperturaCaja } from "@prisma/client";
import { ApiResponseData } from "../definitions";

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
  try {
    const aperturaCaja = await fetch(`${url}/api/apertura-caja/${id}`, {
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
    });
    const data: ApiResponseData = await aperturaCaja.json();
    if (data.error) throw new Error(data.error);
    if (!data.data) throw new Error("Error al actualizar la apertura de caja");
    if (typeof data.data === "undefined")
      throw new Error("Error al actualizar la apertura de caja");
    return data;
  } catch (err) {
    if (err instanceof Error) return err.message;
  }
}
