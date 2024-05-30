
import { ApiResponseData, OperacionAndTipoOperacion } from "../../definitions"

/**
 * Permite obtener todas las operaciones de una cuenta dada por su id
 * @param cuentaId El id de la cuenta de la cual queremos obtener sus operaciones
 * @returns La lista de operaciones, o en caso de error un string del error o undefined
 */
export default async function obtenerOperacionesPorCuentaId(cuentaId:string): Promise<ApiResponseData<OperacionAndTipoOperacion[]>|string|undefined> {
  try{
    const response = await fetch(`/api/operacion/cuenta/${cuentaId}`, {
      headers:{
        "Content-Type": "application/json",
      }
    })

    const data:ApiResponseData<OperacionAndTipoOperacion[]> = await response.json()

    return data
  
  }catch(error){
    if(error instanceof Error) return error.message
  }
}