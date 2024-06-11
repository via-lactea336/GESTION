import ApiError from "@/lib/api/ApiError";
import verifyUser from "@/lib/auth/verifyUser";
import prisma from "@/lib/prisma";
import { AperturaCaja, Caja, Movimiento } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

const crearComprobanteDesdeMovimiento = async (
  movimientoId: string,
  saldoEfectivoApertura: Decimal,
  sum: number,
  username?: string, 
  password?: string, 
  concepto?: string, 
) => {

  if (saldoEfectivoApertura.lessThan(sum))
    throw new ApiError(
      "El monto que se desea extraer excede al saldo de la caja", 400
    );
  if (!username || !password)
    throw new ApiError("Faltan credenciales para crear el comprobante", 400);
  if (!concepto || concepto.length < 10)
    throw new ApiError("Falta el concepto para crear el comprobante. Minimo 10 caracteres", 400);

  const user = await verifyUser(username, password, "ADMIN");

  await prisma.comprobante.create({
    data: {
      movimientoId: movimientoId,
      userId: user.id,
      monto: sum,
      concepto: concepto,
      fechaEmision: new Date(),
    },
  });

}

export default crearComprobanteDesdeMovimiento