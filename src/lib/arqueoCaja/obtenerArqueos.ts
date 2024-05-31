import { ArqueoDeCaja } from "@prisma/client";
import { ApiResponseData } from "../definitions";

/**
 * Permite crear arqueos de caja
 * @returns un arqueos de caja
 */

export default async function obtenerArqueos() {
  const server_url = process.env.URL;
  const url = server_url || "";
  try {
    const arqueoCaja = await fetch(`${url}/api/arqueo-caja`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data: ApiResponseData<ArqueoDeCaja[]> = await arqueoCaja.json();
    if (data.error) throw new Error(data.error);
    if (!data.data) throw new Error("Error al obtener el arqueo de caja");
    return data;
  } catch (err) {
    if (err instanceof Error) return err.message;
  }
}
