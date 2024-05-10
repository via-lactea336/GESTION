
import { Operacion } from "@prisma/client"
import { ApiResponseData } from "../definitions"

/**
 * Permite obtener todas las operaciones de una cuenta dada por su id
 * @param cuentaId El id de la cuenta de la cual queremos obtener sus operaciones
 * @returns La lista de operaciones, o en caso de error un string del error o undefined
 */
export default async function obtenerChequesPorCuentaId(cuentaId:string): Promise<ApiResponseData<Operacion[]>|string|undefined> {
  try{
    const response = await fetch(`/api/operacion/cheque/${cuentaId}`, {
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