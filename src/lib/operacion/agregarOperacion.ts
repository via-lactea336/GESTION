import { ApiResponseData } from "../definitions";

/**
 * Permite crear una operacion en la base de datos
 * @param tipoOperacionId El tipo de operacion ha ser realizada
 * @param fechaOperacion Fecha en la que se realiza la operacion
 * @param monto Monto de la operacion
 * @param cuentaBancariaOrigenId Es la cuenta de la empresa que se vera afectada en la operacion
 * @param bancoInvolucado Es el banco desde donde se realizo la operacion
 * @param nombreInvolucrado Es el nombre del individuo externo involucrado en la operacion
 * @param cuentaInvolucrado Es la cuenta del individuo externo involucrado en la operacion
 * @param rucInvolucrado Es el documento del individuo externo involucrado en la operacion
 * @param concepto Es el concepto de la operacion
 * @param numeroComprobante Es el comprobante de la operacion realizada
 * @returns
 */
export default async function agregarOperacion(
  tipoOperacionId: string,
  fechaOperacion: Date,
  monto: number,
  cuentaBancariaOrigenId: string,
  bancoInvolucrado: string,
  nombreInvolucrado: string,
  cuentaInvolucrado: string,
  rucInvolucrado: string,
  concepto: string,
  numeroComprobante: string
): Promise<ApiResponseData | string | undefined> {
  try {
    const response = await fetch("/api/operacion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tipoOperacionId: tipoOperacionId,
        fechaOperacion: fechaOperacion,
        monto: monto,
        cuentaBancariaOrigenId: cuentaBancariaOrigenId,
        bancoInvolucrado: bancoInvolucrado,
        nombreInvolucrado: nombreInvolucrado,
        cuentaInvolucrado: cuentaInvolucrado,
        rucInvolucrado: rucInvolucrado,
        concepto: concepto,
        numeroComprobante: numeroComprobante,
      }),
    });

    const data: ApiResponseData = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) return error.message;
  }
}
