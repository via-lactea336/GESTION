import { ApiResponseData, ArqueoCajaData } from "../definitions";

/**
 * Permite actualizar un arqueo de caja
 * @returns el arqueo de caja actualizado
 */

export default async function actualizarArqueoPorId({
  aperturaId,
  montoRegistrado,
}: ArqueoCajaData) {
  const server_url = process.env.URL;
  const url = server_url || "";
  try {
    const arqueoCaja = await fetch(`${url}/api/arqueo-caja/${aperturaId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        montoRegistrado,
      }),
    });
    const data: ApiResponseData = await arqueoCaja.json();
    if (data.error) throw new Error(data.error);
    if (!data.data) throw new Error("Error al actualizar el arqueo de caja");
    if (typeof data.data === "undefined")
      throw new Error("Error al actualizar el arqueo de caja");
    return data;
  } catch (err) {
    if (err instanceof Error) return err.message;
  }
}
