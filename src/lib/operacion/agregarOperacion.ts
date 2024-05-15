import { ApiResponseData } from "../definitions"

export default async function agregarOperacion(
  tipoOperacionId: string,
  fechaOperacion: Date,
  monto: number,
  cuentaBancariaOrigenId: string,
  bancoInvolucado: string,
  nombreInvolucrado: string,
  cuentaInvolucrado: string,
  rucInvolucrado: string,
  concepto: string,
  numeroComprobante: string
): Promise<ApiResponseData|string|undefined> {
  try{
    const response = await fetch("/api/operacion", {
      method: "POST",
      headers:{
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tipoOperacionId: tipoOperacionId,
        fechaOperacion: fechaOperacion,
        monto: monto,
        cuentaBancariaOrigenId: cuentaBancariaOrigenId,
        bancoInvolucrado: bancoInvolucado,
        nombreInvolucrado: nombreInvolucrado,
        cuentaInvolucrado: cuentaInvolucrado,
        rucInvolucrado: rucInvolucrado,
        concepto: concepto,
        numeroComprobante: numeroComprobante       
      })
    })

    const data:ApiResponseData = await response.json()
    return data
  
  }catch(error){
    if(error instanceof Error) return error.message
  }
}