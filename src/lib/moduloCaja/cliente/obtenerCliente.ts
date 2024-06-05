import { Cliente } from "@prisma/client";
import { ApiResponseData } from "@/lib/definitions";

/**
 * @param {string} id
 * @returns {Promise<ApiResponseData<Cliente>>}
 * @description Obtiene un cliente por su id
 */

export default async function obtenerCliente(id: string) {
  const server_url = process.env.URL;
  const url = server_url || "";
  try {
    const cliente = await fetch(`${url}/api/cliente/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data: ApiResponseData<Cliente> = await cliente.json();
    if (data.error) throw new Error(data.error);
    if (!data.data) throw new Error("Error al obtener el cliente");
    if (typeof data.data === "undefined")
      throw new Error("Error al obtener el cliente");
    return data;
  } catch (err) {
    if (err instanceof Error) return err.message;
  }
}
