import { Cheque } from "@prisma/client"
import { ApiResponseData } from "../../definitions"

export default async function obtenerChequePorId(id:string): Promise<ApiResponseData<Cheque>|string|undefined> {
  try{
    const response = await fetch(`/api/cheque/${id}`, {
      headers:{
        "Content-Type": "application/json",
      }
    })

    const data:ApiResponseData<Cheque> = await response.json()

    return data
  
  }catch(error){
    if(error instanceof Error) return error.message
  }
}