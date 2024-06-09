import { Caja } from "@prisma/client";
import { ApiResponseData } from "../../definitions";

/**
 * Obtiene una caja de la base de datos
 * @param id el id de la caja a obtener
 * @returns la caja obtenida
 */

export default async function obtenerCajaPorId(id: string) {
  const server_url = process.env.URL;
  const url = server_url || "";
  try {
    const caja = await fetch(`${url}/api/caja/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data: ApiResponseData<Caja> = await caja.json();
    if (data.error) throw new Error(data.error);
    if (!data.data) throw new Error("Error al obtener la caja");
    return data;
  } catch (err) {
    if (err instanceof Error) return err.message;
  }
}
