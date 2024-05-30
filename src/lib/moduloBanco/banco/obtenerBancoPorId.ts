import { Banco } from "@prisma/client"
import { ApiResponseData } from "../../definitions"

export default async function obtenerBancoPorId(id:string): Promise<ApiResponseData<Banco>|string|undefined> {
  try{
    const response = await fetch(`/api/banco/${id}`, {
      headers:{
        "Content-Type": "application/json",
      }
    })

    const data:ApiResponseData<Banco> = await response.json()

    return data
  
  }catch(error){
    if(error instanceof Error) return error.message
  }
}