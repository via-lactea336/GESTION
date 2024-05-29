import { AperturaCaja } from "@prisma/client";
import { AperturaCajaData, ApiResponseData } from "../definitions";

/**
 * Permite crear una apertura de caja
 * @returns la apertura de caja creada
 */

export default async function crearApertura({
  cajaId,
  cajeroId,
  apertura,
  saldoInicial,
  observaciones,
}: AperturaCajaData) {
  const server_url = process.env.URL;
  const url = server_url || "";
  try {
    const aperturaCaja = await fetch(`${url}/api/apertura-caja`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cajaId,
        cajeroId,
        apertura,
        saldoInicial,
        observaciones,
      }),
    });
    const data: ApiResponseData = await aperturaCaja.json();
    if (data.error) throw new Error(data.error);
    if (!data.data) throw new Error("Error al crear la apertura de caja");
    if (typeof data.data === "undefined")
      throw new Error("Error al crear la apertura de caja");
    return data;
  } catch (err) {
    if (err instanceof Error) return err.message;
  }
}
