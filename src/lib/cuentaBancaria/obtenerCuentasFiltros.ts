import { CuentaBancariaAndBanco } from "../definitions"
import { ApiResponseData } from "../definitions"

export default async function obtenerCuentasFiltros(
  {
    bancoId,
    esCuentaAhorro,
    deleted,
  }:{
    bancoId?:string,
    esCuentaAhorro?:boolean
    deleted:boolean
  }
){
  
  const searchParams = new URLSearchParams()

  if (bancoId) searchParams.append('bancoId', bancoId)
  if (esCuentaAhorro) searchParams.append('esCuentaAhorro', `${esCuentaAhorro}`)
  if (deleted !== null || deleted !== undefined) searchParams.append('deleted', `${deleted}`)
  
  const queryString = searchParams.toString();

  try{
    const response = await fetch(`http://localhost:3000/api/cuenta/search?${queryString}`, {
      headers: {
        "Content-Type": "application/json",
      },
    }) 

    const data:ApiResponseData<CuentaBancariaAndBanco[]> = await response.json()
    return data
  }catch(error){
    if(error instanceof Error) return error.message
  }

}