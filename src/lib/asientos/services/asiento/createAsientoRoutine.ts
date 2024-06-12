import prisma from "@/lib/prisma"

const crearAsientoRoutine = async () => {

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existingAsiento = await prisma.asiento.findFirst({
    where: {
      fecha: today,
    },
  });

  if (!existingAsiento) {
    await prisma.asiento.create({
      data: {
        fecha: today,
        descripcion: "Asiento automatico diario"
      },
    });
  }

}

export default crearAsientoRoutine