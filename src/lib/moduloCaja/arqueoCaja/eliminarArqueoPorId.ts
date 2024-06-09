import { ApiResponseData } from "../../definitions";

/**
 * Permite eliminar un arqueo de caja por su id
 * @param id el id del arqueo de caja
 * @returns el arqueo de caja eliminado
 **/

export default async function eliminarArqueoPorId(id: string) {
  const server_url = process.env.URL;
  const url = server_url || "";
  try {
    const arqueoCaja = await fetch(`${url}/api/arqueo-caja/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data: ApiResponseData = await arqueoCaja.json();
    if (data.error) throw new Error(data.error);
    if (!data.data) throw new Error("Error al eliminar el arqueo de caja");
    if (typeof data.data === "undefined")
      throw new Error("Error al eliminar el arqueo de caja");
    return data;
  } catch (err) {
    if (err instanceof Error) return err.message;
  }
}
