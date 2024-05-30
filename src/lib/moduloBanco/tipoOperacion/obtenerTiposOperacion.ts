import { TipoOperacion } from "@prisma/client"
import { ApiResponseData } from "../../definitions"

export default async function obtenerTiposOperacion(): Promise<ApiResponseData<TipoOperacion[]>|string|undefined> {
  try{
    const response = await fetch("/api/tipo-operacion", {
      headers:{
        "Content-Type": "application/json",
      }
    })

    const data:ApiResponseData<TipoOperacion[]> = await response.json()

    return data
  
  }catch(error){
    if(error instanceof Error) return error.message
  }
}