import ApiError from "@/lib/api/ApiError";
import verifyUser from "@/lib/auth/verifyUser";
import prisma from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";

const crearComprobanteDesdeMovimiento = async (
  movimientoId: string,
  sum: number,
  username: string,
  password: string,
  concepto: string
) => {
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
};

export default crearComprobanteDesdeMovimiento;
