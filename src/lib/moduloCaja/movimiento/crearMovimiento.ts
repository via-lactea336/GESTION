import { fetchPlus } from "@/lib/verificarApiResponse";
import { medioDePago } from "@prisma/client";

type Params = {
  mov:{
    aperturaId:string,
    esIngreso:boolean
    monto:number
    facturaId?:string
  },
  movsDetalles:{
    metodoPago: medioDePago,
    monto:number 
    concepto?:string
  }[],
  username?:string,
  password?:string,
  concepto?:string,
}

export default async function crearMovimiento({mov, movsDetalles, username, password, concepto}:Params) {
  const server_url = process.env.URL;
  const url = server_url || "";
  try {
    if(!mov.esIngreso && !(username && password && concepto)) throw new Error("Si el movimiento es de egreso debe de enviar las credenciales y un concepto")
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
          facturaId: mov.facturaId
        },
        movsDetalles: movsDetalles,
        username: username, 
        password: password, 
        concepto: concepto, 
      }),
    });
    return aperturaCaja
  } catch (err) {
    if (err instanceof Error) return err.message;
  }
}
