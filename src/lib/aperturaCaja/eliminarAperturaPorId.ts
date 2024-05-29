import { AperturaCaja } from "@prisma/client";
import { ApiResponseData } from "../definitions";

/**
 * Permite eliminar una apertura de caja por su id
 * @returns una apertura de caja
 */

export default async function eliminarAperturaPorId({ id }: { id: string }) {
  const server_url = process.env.URL;
  const url = server_url || "";
  try {
    const aperturasCaja = await fetch(`${url}/api/apertura-caja/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "DELETE",
    });
    const data: ApiResponseData = await aperturasCaja.json();
    return data;
  } catch (err) {
    if (err instanceof Error) return err.message;
  }
}
