import { ApiResponseData, CajaData } from "../definitions";

/**
 * Actualiza una caja en la base de datos
 * @param id el id de la caja a actualizar
 */

export default async function actualizarCajaPorId(
  id: string,
  newData: CajaData
) {
  const server_url = process.env.URL;
  const url = server_url || "";
  try {
    const caja = await fetch(`${url}/api/caja/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newData),
    });
    const data: ApiResponseData = await caja.json();
    if (data.error) throw new Error(data.error);
    if (!data.data) throw new Error("Error al actualizar la caja");
    return data;
  } catch (err) {
    if (err instanceof Error) return err.message;
  }
}
