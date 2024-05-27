import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { Cheque } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import {
  generateApiErrorResponse,
  generateApiSuccessResponse,
} from "@/lib/apiResponse";
import { estadoCheque } from "@prisma/client";

export async function POST(req: NextRequest) {
  const body: Cheque = await req.json();
  const {
    operacionId,
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
    !operacionId ||
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
  //Y verifica que esta cuenta exista
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

  //Verificar que el librador y el acreedor no sean iguales
  if (
    involucrado.trim() === cuentaBancariaAfectada.entidad.nombre.trim()
  )
    return generateApiErrorResponse(
      "El emisor del cheque y el acreedor no pueden ser iguales",
      400
    );

  //Se obitene el id del banco de la cuenta afectada
  const bancoCuentaAfectada = cuentaBancariaAfectada.bancoId;

  try {
    const cheque = await prisma.cheque.create({
      data: {
        operacionId,
        numeroCheque,
        involucrado,
        monto,
        esRecibido,
        fechaEmision,
        // En caso de que el cheque sea uno que nos depositen a nosotros (la empresa),
        // Entonces se tomara el caso de que elcheque esta cobrado y que afecta a nuestros saldos retenido y disponible
        fechaPago:
          esRecibido
            ? fechaEmision
            : null,
        estado:
          esRecibido
            ? estadoCheque.PAGADO
            : undefined,
        bancoChequeId,
        cuentaBancariaAfectadaId,
      },
    });

    if (!cheque) return generateApiErrorResponse("Error generando cheque", 400);

    return generateApiSuccessResponse(200, "cheque agregado correctamente");

  } catch (err) {
    console.log(err);
    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002")
      return generateApiErrorResponse(
        "Un cheque con el mismo numero ya existe",
        400
      )
    else return generateApiErrorResponse("Algo ha salido mal generando el cheque", 500);
  }
}

export async function GET() {
  const cheque = await prisma.cheque.findMany();
  return generateApiSuccessResponse(200, "Lista de cheques", cheque);
}
