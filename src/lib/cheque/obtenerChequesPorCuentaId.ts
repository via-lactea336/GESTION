
import { ApiResponseData, ChequeDetails } from "../definitions"

export default async function obtenerChequesPorCuentaId(cuentaId:string): Promise<ApiResponseData<ChequeDetails[]>|string|undefined> {
  try{
    const response = await fetch(`/api/cheque/cuenta/${cuentaId}`, {
      headers:{
        "Content-Type": "application/json",
      }
    })

    const data:ApiResponseData<ChequeDetails[]> = await response.json()

    return data
  
  }catch(error){
    if(error instanceof Error) return error.message
  }
}