import { ArqueoDeCaja } from "@prisma/client";
import { ApiResponseData, ArqueoCajaData } from "../definitions";

/**
 * Permite crear arqueos de caja
 * @returns un arqueos de caja
 */

export default async function crearArqueo(arqueo: ArqueoCajaData) {
  const server_url = process.env.URL;
  const url = server_url || "";
  try {
    const arqueoCaja = await fetch(`${url}/api/arqueo-caja`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(arqueo),
    });
    const data: ApiResponseData = await arqueoCaja.json();
    if (data.error) throw new Error(data.error);
    if (!data.data) throw new Error("Error al crear el arqueo de caja");
    return data;
  } catch (err) {
    if (err instanceof Error) return err.message;
  }
}
