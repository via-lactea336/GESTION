import { TipoOperacion } from "@prisma/client"
import { ApiResponseData } from "../../definitions"

export default async function obtenerTipoOperacionPorId(id:string): Promise<ApiResponseData<TipoOperacion>|string|undefined> {
  try{
    const response = await fetch(`/api/tipo-operacion/${id}`, {
      headers:{
        "Content-Type": "application/json",
      }
    })

    const data:ApiResponseData<TipoOperacion> = await response.json()

    return data
  
  }catch(error){
    if(error instanceof Error) return error.message
  }
}