import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
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