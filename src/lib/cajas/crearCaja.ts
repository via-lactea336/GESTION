import { Caja } from "@prisma/client";
import { ApiResponseData } from "../definitions";

/**
 * Crea una caja en la base de datos
 * @param numeroDeCaja el numero de la caja a crear
 * @returns la caja creada
 * */

export default async function crearCaja(numeroDeCaja: number) {
  const server_url = process.env.URL;
  const url = server_url || "";
  try {
    const cajaCreada = await fetch(`${url}/api/caja`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ numero: numeroDeCaja }),
    });
    const data: ApiResponseData = await cajaCreada.json();
    if (data.error) throw new Error(data.error);
    if (!data.data) throw new Error("Error al crear la caja");
    return data;
  } catch (err) {
    if (err instanceof Error) return err.message;
  }
}
