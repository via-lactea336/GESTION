import { ArqueoDeCaja } from "@prisma/client";
import { ApiResponseData } from "../definitions";

/**
 * Permite obtener un arqueo de caja por su id
 * @param id el id del arqueo de caja
 * @returns el arqueo de caja
 **/

export default async function obtenerArqueoPorId(id: string) {
  const server_url = process.env.URL;
  const url = server_url || "";
  try {
    const arqueoCaja = await fetch(`${url}/api/arqueo-caja/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data: ApiResponseData<ArqueoDeCaja> = await arqueoCaja.json();
    if (data.error) throw new Error(data.error);
    if (!data.data) throw new Error("Error al obtener el arqueo de caja");
    if (typeof data.data === "undefined")
      throw new Error("Error al obtener el arqueo de caja");
    return data;
  } catch (err) {
    if (err instanceof Error) return err.message;
  }
}
