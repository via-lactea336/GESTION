import { AperturaCaja } from "@prisma/client";
import { ApiResponseData } from "../definitions";

/**
 * Permite obtener todas las aperturas de caja
 * @returns Un arreglo con todas las aperturas de caja
 */

export default async function obtenerAperturas() {
  const server_url = process.env.URL;
  const url = server_url || "";
  try {
    const aperturasCaja = await fetch(`${url}/api/apertura-caja`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data: ApiResponseData<AperturaCaja[]> = await aperturasCaja.json();
    if (data.error) throw new Error(data.error);
    if (!data.data) throw new Error("Error al obtener las aperturas de caja");
    if (data.data.length === 0)
      throw new Error("No hay aperturas de caja registradas");
    if (typeof data.data === "undefined")
      throw new Error("Error al obtener las aperturas de caja");
    return data;
  } catch (err) {
    if (err instanceof Error) return err.message;
  }
}
