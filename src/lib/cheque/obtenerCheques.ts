import { Cheque } from "@prisma/client"
import { ApiResponseData } from "../definitions"

export default async function obtenerCheques(): Promise<ApiResponseData<Cheque[]>|string|undefined> {
  try{
    const response = await fetch("/api/cheque", {
      headers:{
        "Content-Type": "application/json",
      }
    })

    const data:ApiResponseData<Cheque[]> = await response.json()

    return data
  
  }catch(error){
    if(error instanceof Error) return error.message
  }
}