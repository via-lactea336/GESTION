import { CuentaBancaria } from "@prisma/client"
import { ApiResponseData } from "../definitions"

export default async function obtenerOperacionesFiltros(
  {
    bancoId,
    esCuentaAhorro,
    deleted,
  }:{
    bancoId?:string,
    esCuentaAhorro?:boolean
    deleted:boolean
  }
){
  
  let searchParams = "http://localhost:3000/api/cuenta/search?"

  if(bancoId) searchParams += `bancoId=${bancoId}`
  if(esCuentaAhorro) searchParams += `&esCuentaAhorro=${esCuentaAhorro}`
  if(deleted !== null || deleted !== undefined) searchParams += `&deleted=${deleted}`

  try{
    const response = await fetch(searchParams, {
      headers: {
        "Content-Type": "application/json",
      },
    }) 

    const data:ApiResponseData<CuentaBancaria[]> = await response.json()
    return data
  }catch(error){
    if(error instanceof Error) return error.message
  }

}