import { ApiResponseData } from "../definitions"

export default async function agregarCuentaBancaria(
  numeroCuenta: string,
  bancoId: string,
  entidadId: string,
  esCuentaAhorro: boolean,
  saldo: number,
  saldoDisponible: number
): Promise<ApiResponseData|string|undefined> {
  try{
    const response = await fetch("/api/cuenta", {
      method: "POST",
      headers:{
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        numeroCuenta: numeroCuenta,
        bancoId: bancoId,
        entidadId: entidadId,
        esCuentaAhorro: esCuentaAhorro,
        saldo: saldo,
        saldoDisponible: saldoDisponible
      })
    })

    const data:ApiResponseData = await response.json()
    return data
  
  }catch(error){
    if(error instanceof Error) return error.message
  }
}