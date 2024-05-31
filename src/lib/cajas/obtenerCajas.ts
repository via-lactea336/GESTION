import { Caja } from "@prisma/client";
import { ApiResponseData } from "../definitions";

/**
 * Obtiene las cajas de la base de datos
 * @returns una lista de cajas
 */

export default async function obtenerCajas() {
  const server_url = process.env.URL;
  const url = server_url || "";
  try {
    const cajas = await fetch(`${url}/api/caja`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data: ApiResponseData<Caja[]> = await cajas.json();
    if (data.error) throw new Error(data.error);
    if (!data.data) throw new Error("Error al obtener las cajas");
    if (data.data.length === 0) throw new Error("No hay cajas registradas");
    if (typeof data.data === "undefined")
      throw new Error("Error al obtener las cajas");
    return data;
  } catch (err) {
    if (err instanceof Error) return err.message;
  }
}
