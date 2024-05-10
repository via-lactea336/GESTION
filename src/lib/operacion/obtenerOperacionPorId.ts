import { Operacion, CuentaBancaria, TipoOperacion, Entidad, Banco } from "@prisma/client"
import { ApiResponseData } from "../definitions"

type OperacionDetails = Operacion & {
  tipoOperacion: TipoOperacion;
  cuentaBancariaOrigen: CuentaBancaria & {banco: Banco} & {entidad: Entidad};
}

export default async function obtenerOperacionPorId(id:string): Promise<ApiResponseData<OperacionDetails>|string|undefined> {
  try{
    const response = await fetch(`http://localhost:3000/api/operacion/${id}`, {
      headers:{
        "Content-Type": "application/json",
      }
    })

    const data:ApiResponseData<OperacionDetails> = await response.json()
    console.log(data)
    return data

  }catch(error){
    if(error instanceof Error) return error.message
  }
}