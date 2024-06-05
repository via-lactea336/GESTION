import { ApiResponseData } from "@/lib/definitions";
import { medioDePago } from "@prisma/client";

type Params = {
  mov:{
    aperturaId:string,
    esIngreso:boolean
    monto:number
  },
  movsDetalles?:{
    metodoPago: medioDePago,
    monto:number 
  }[]
}

export default async function crearMovimiento({mov, movsDetalles}:Params) {
  const server_url = process.env.URL;
  const url = server_url || "";
  try {
    const aperturaCaja = await fetch(`${url}/api/movimiento`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        apertura: {
          aperturaId: mov.aperturaId,
          esIngreso: mov.esIngreso,
          monto: mov.monto,
        },
        movsDetalles: movsDetalles || null,
      }),
    });
    const data: ApiResponseData = await aperturaCaja.json();
    if (data.error) throw new Error(data.error);
    return data;
  } catch (err) {
    if (err instanceof Error) return err.message;
  }
}
