import { ApiResponseData } from "../definitions"

/**
 * Permite crear un cheque en la base de datos
 * @param numeroCheque Es el numero del cheque, debe ser unico
 * @param esRecibido Permite saber si el cheque es recibido o emitido por nosotros
 * @param monto Es el valor del cheque
 * @param fechaEmision La fecha en la que se emite el cheque
 * @param fechaPago La fecha en la que se paga el cheque
 * @param emitidoPor Nombre del usuario que emite el cheque
 * @param acreedor Nombre del usuario a quien esta acreditado el cheque
 * @param estado Estado del cheque
 * @param bancoChequeId Banco al que pertenece el cheque
 * @param tipoOperacionId El tipo de operacion que se realizara con el cheque en cuestion
 * @param cuentaBancariaAfectadaId La cuenta que se vera afectada con el cheque
 * @returns 
 */
export default async function agregarCheque(
  numeroCheque: string,
  esRecibido: boolean,
  monto: number,
  fechaEmision: Date,
  fechaPago: Date,
  emitidoPor: string,
  acreedor: string,
  estado: string,
  bancoChequeId: string,
  tipoOperacionId: string,
  cuentaBancariaAfectadaId: string
): Promise<ApiResponseData|string|undefined> {
  try{
    const response = await fetch("/api/cheque", {
      method: "POST",
      headers:{
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        numeroCheque: numeroCheque,
        esRecibido: esRecibido,
        monto: monto,
        fechaEmision: fechaEmision,
        fechaPago: fechaPago,
        emitidoPor: emitidoPor,
        acreedor: acreedor,
        estado: estado,
        bancoChequeId: bancoChequeId,
        tipoOperacionId: tipoOperacionId,
        cuentaBancariaAfectadaId: cuentaBancariaAfectadaId
      })
    })

    const data:ApiResponseData = await response.json()
    return data
  
  }catch(error){
    if(error instanceof Error) return error.message
  }
}