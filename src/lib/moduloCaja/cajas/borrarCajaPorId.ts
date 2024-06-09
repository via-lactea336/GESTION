import { Caja } from "@prisma/client";
import { ApiResponseData } from "../../definitions";

/**
 * Borra una caja de la base de datos
 * @param id el id de la caja a borrar
 * @returns la caja obtenida
 */

export default async function borrarCajaPorId(id: string) {
  const server_url = process.env.URL;
  const url = server_url || "";
  try {
    const caja = await fetch(`${url}/api/caja/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ deleteFromDB: true }),
    });
    const data: ApiResponseData = await caja.json();
    if (data.error) throw new Error(data.error);
    if (!data.data) throw new Error("Error al borrar la caja");
    return data;
  } catch (err) {
    if (err instanceof Error) return err.message;
  }
}
