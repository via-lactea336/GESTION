import { Banco } from "@prisma/client"
import { ApiResponseData } from "../definitions"

export default async function obtenerBancos(): Promise<ApiResponseData<Banco[]>|string|undefined> {
  try{
    const response = await fetch("/api/banco", {
      headers:{
        "Content-Type": "application/json",
      }
    })

    const data:ApiResponseData<Banco[]> = await response.json()

    return data
  
  }catch(error){
    if(error instanceof Error) return error.message
  }
}