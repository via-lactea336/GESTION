import { ApiResponseData } from "../../definitions"

export type Props = {
  factura:{
    clienteId:string,
    esContado:boolean,
    total:number,
    ivaTotal:number,
    totalSaldoPagado:number
  },
  facturaDetalles?:{
    productoId:string,
    costoUnit:number,
    cantidad:number,
    monto:number,
    iva:number,
    ivaPorcent:number|null
  }[]
}

export default async function obtenerReciboFiltro(
  {
    factura, facturaDetalles
  }:Props
  
){
  const server_url = process.env.URL;
  const url = server_url || "";
  try{
    const response = await fetch(`${url}/api/factura`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        factura,
        facturaDetalles
      }),
    }) 
    const data:ApiResponseData = await response.json()
    return data
  }catch(error){
    if(error instanceof Error) return error.message
  }
}