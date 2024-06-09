import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const reiniciarFacturas = async () => {
  const facturas = await prisma.factura.updateMany({
    data: {
      totalSaldoPagado: 0,
      pagado:false,
    }
  })
  if (facturas.count === 0) throw new Error("No hay facturas para reiniciar");
  console.log("facturas reiniciadas")
  return facturas
}

reiniciarFacturas().catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });