import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function getNextMonthDate(date) {
    const nextMonthDate = new Date(date);
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
  
    // Ajustar el día del mes si la fecha del próximo mes no es válida
    // (por ejemplo, de enero 31 a marzo 3, ya que febrero 31 no es válido)
    if (nextMonthDate.getDate() !== date.getDate()) {
      nextMonthDate.setDate(0); // Configurar al último día del mes anterior
    }
  
    return nextMonthDate;
}

async function main() {

    const cheques = await prisma.cheque.deleteMany(
        {
            where: {
                cuentaBancariaAfectadaId: "4038d0c3-19bb-45ec-ad54-b78996b9c811"
            }
        }
    );

    const operaciones = await prisma.operacion.deleteMany(
        {
            where: {
                cuentaBancariaOrigenId: "4038d0c3-19bb-45ec-ad54-b78996b9c811"
            }
        }
    );

}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        console.log("Cerrando conexión con la base de datos...");
        await prisma.$disconnect();
    });