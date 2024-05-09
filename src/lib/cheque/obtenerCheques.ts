import { Operacion } from "@prisma/client"
import { ApiResponseData } from "../definitions"

export default async function obtenerCheques(): Promise<ApiResponseData<Operacion[]>|string|undefined> {
  try{
    const response = await fetch("/api/cheque", {
      headers:{
        "Content-Type": "application/json",
      }
    })

    const data:ApiResponseData<Operacion[]> = await response.json()

    return data
  
  }catch(error){
    if(error instanceof Error) return error.message
  }
}