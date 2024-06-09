import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

  // Delete Cheque
  await prisma.cheque.deleteMany({});
  
  // Delete operations
  await prisma.operacion.deleteMany({});

  // Delete tipoOperacion
  await prisma.tipoOperacion.deleteMany({});

  // Delete cuentaBancaria
  await prisma.cuentaBancaria.deleteMany({});

  // Delete entidad
  await prisma.entidad.deleteMany({});

  // Delete banco
  await prisma.banco.deleteMany({});
  
  //CAJA
  await prisma.comprobante.deleteMany({});
  
  await prisma.movimientoDetalle.deleteMany({});

  await prisma.movimiento.deleteMany({});

  await prisma.registroCaja.deleteMany({});

  await prisma.arqueoDeCaja.deleteMany({});

  await prisma.aperturaCaja.deleteMany({});

  await prisma.recibos.deleteMany({});

  await prisma.factura.deleteMany({});
 
  await prisma.cliente.deleteMany({});

  console.log("All records have been deleted.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });