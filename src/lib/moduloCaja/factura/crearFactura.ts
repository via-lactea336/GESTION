import { ApiResponseData } from "../../definitions"

export type Props = {
  factura:{
    clienteId:string,
    esContado:boolean,
    total:number,
    ivaTotal:number,
    totalSaldoPagado:number,
    concepto?:string
  }
}

export default async function obtenerReciboFiltro(
  {
    factura,
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
      }),
    }) 
    const data:ApiResponseData = await response.json()
    return data
  }catch(error){
    if(error instanceof Error) return error.message
  }
}