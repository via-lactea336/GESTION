import prisma from "@/lib/prisma"

const crearAsientoRoutine = async () => {

  const today = new Date();

  const existingAsiento = await prisma.asiento.findFirst({
    where: {
      fecha: today,
    },
  });

  if (!existingAsiento) {
    await prisma.asiento.createMany({
      data:[
        {
          fecha: today,
          descripcion: "COBRO FACTURAS"
        },
        {
          fecha: today,
          descripcion: "EXTRACCION CAJA"
        },
      ],
    });
  }

}

export default crearAsientoRoutine