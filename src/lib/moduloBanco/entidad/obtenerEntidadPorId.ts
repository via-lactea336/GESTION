import { Entidad } from "@prisma/client"
import { ApiResponseData } from "../../definitions"

export default async function obtenerCuentaBancariaPorId(id:string): Promise<ApiResponseData<Entidad>|string|undefined> {
  try{
    const response = await fetch(`/api/entidad/${id}`, {
      headers:{
        "Content-Type": "application/json",
      }
    })

    const data:ApiResponseData<Entidad> = await response.json()

    return data
  
  }catch(error){
    if(error instanceof Error) return error.message
  }
}