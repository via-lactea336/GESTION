import { fetchPlus } from "@/lib/verificarApiResponse";
import { medioDePago } from "@prisma/client";

type Params = {
  mov:{
    aperturaId:string,
    esIngreso:boolean
    monto:number
    facturaId:string
  },
  movsDetalles:{
    metodoPago: medioDePago,
    monto:number 
  }[]
}

export default async function crearMovimiento({mov, movsDetalles}:Params) {
  const server_url = process.env.URL;
  const url = server_url || "";
  try {
    const aperturaCaja = await fetchPlus(`${url}/api/movimiento`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mov: {
          aperturaId: mov.aperturaId,
          esIngreso: mov.esIngreso,
          monto: mov.monto,
        },
        movsDetalles: movsDetalles,
      }),
    });
    return aperturaCaja
  } catch (err) {
    if (err instanceof Error) return err.message;
  }
}
