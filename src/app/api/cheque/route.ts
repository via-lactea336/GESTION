import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { Cheque } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import {
  generateApiErrorResponse,
  generateApiSuccessResponse,
} from "@/lib/apiResponse";
import reflejarCheque from "@/lib/cheque/reflejarCheque";
import { estadoCheque } from "@prisma/client";

export async function POST(req: NextRequest) {
  const body: Cheque = await req.json();
  const {
    esRecibido,
    numeroCheque,
    monto,
    fechaEmision,
    bancoChequeId,
    cuentaBancariaAfectadaId,
    involucrado,
  } = body;

  console.log("body", body);

  if (
    !numeroCheque ||
    !monto ||
    !involucrado ||
    esRecibido === null ||
    !fechaEmision ||
    !bancoChequeId ||
    !cuentaBancariaAfectadaId
  )
    return generateApiErrorResponse(
      "No existe informacion suficiente para generar el registro del cheque",
      400
    ); //Validate data

  //Obtiene la cuenta bactaria que se vera afectada en la operacion
  const cuentaBancariaAfectada = await prisma.cuentaBancaria.findUnique({
    where: {
      id: cuentaBancariaAfectadaId,
    },
    include: {
      entidad: true,
    },
  });
  if (!cuentaBancariaAfectada)
    return generateApiErrorResponse(
      "No existe la cuenta la cual se vera afectada por esta operacion", 404
    );

  if (
    involucrado.trim() === cuentaBancariaAfectada.entidad.nombre.trim()
  )
    return generateApiErrorResponse(
      "El emisor del cheque y el acreedor no pueden ser iguales",
      400
    );

  if (Number(monto) <= 0 || !Number.isInteger(Number(monto)))
    return generateApiErrorResponse("Monto invalido", 400);

  //Se verifica si el saldo de la cuenta afectada es suficiente para realizar la operacion en caso de que sea de debito
  if (
    !esRecibido &&
    Number(cuentaBancariaAfectada.saldoDisponible) - Number(monto) <= 0
  )
    return generateApiErrorResponse("Saldo disponible insuficiente para emitir el cheque", 400);

  if (!esRecibido && Number(cuentaBancariaAfectada.saldo) - Number(monto) <= 0)
    throw generateApiErrorResponse("Saldo retenido insuficiente para emitir el cheque", 400);

  //Se obitene el id del banco de la cuenta afectada
  const bancoCuentaAfectada = cuentaBancariaAfectada.bancoId;

  try {
    const cheque = await prisma.cheque.create({
      data: {
        numeroCheque,
        involucrado,
        monto,
        esRecibido,
        fechaEmision,
        //En caso de que el cheque sea uno que nos depositen a nosotros (la empresa) y que el cheque sea del mismo banco,
        //Entonces eso significa que el cheque esta cobrado y que afecta a nuestros saldos retenido y disponible
        fechaPago:
          esRecibido && bancoChequeId === bancoCuentaAfectada
            ? fechaEmision
            : null,
        estado:
          esRecibido && bancoChequeId === bancoCuentaAfectada
            ? estadoCheque.PAGADO
            : undefined,
        bancoChequeId,
        cuentaBancariaAfectadaId,
      },
    });

    if (!cheque) return generateApiErrorResponse("Error generando cheque", 400);

    await reflejarCheque(
      monto,
      bancoCuentaAfectada,
      cuentaBancariaAfectadaId,
      bancoChequeId,
      esRecibido
    );

    return generateApiSuccessResponse(200, "cheque agregado correctamente");
  } catch (err) {
    console.log(err);
    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002")
      return generateApiErrorResponse(
        "Un cheque con el mismo identificador ya existe",
        400
      );
    else return generateApiErrorResponse("Algo ha salido mal", 500);
  }
}

export async function GET() {
  const cheque = await prisma.cheque.findMany();

  return generateApiSuccessResponse(200, "Lista de cheques", cheque);
}
