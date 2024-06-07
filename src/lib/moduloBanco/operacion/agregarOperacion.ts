import { ApiResponseData } from "../../definitions";

export type CrearOperacionFields = {
  tipoOperacionId: string,
  fechaOperacion: Date,
  monto: number,
  cuentaBancariaOrigenId: string,
  nombreInvolucrado: string,
  concepto: string,
  numeroComprobante: string,
  cuentaInvolucrado?: string,
  rucInvolucrado?: string,
  bancoInvolucrado?: string,
  cheques?: {
    numeroCheque: string,
    involucrado: string,
    monto: number,
    fechaEmision: string,
    esRecibido: boolean,
    bancoChequeId: string,
  }[]
}

export default async function agregarOperacion(
  {
    tipoOperacionId,
    fechaOperacion,
    monto,
    cuentaBancariaOrigenId,
    nombreInvolucrado,
    concepto,
    numeroComprobante,
    cuentaInvolucrado,
    rucInvolucrado,
    bancoInvolucrado,
    cheques
  }: CrearOperacionFields
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
        cheques: cheques
      }),
    });

    const data: ApiResponseData = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) return error.message;
  }
}
