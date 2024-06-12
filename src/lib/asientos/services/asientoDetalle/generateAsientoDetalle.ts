import prisma from "@/lib/prisma"

const generateAsientoDetalle = async (codigoCuenta:string) => {
  await prisma.$transaction(async (tx) => {
    const cuenta = await tx.cuenta.findUnique({
      where: {
        codigo: codigoCuenta
      },
      select:{
        id: true,
      }
    })

    const asiento = await tx.asiento.findFirst({
      where: {
        fecha: new Date()
      },
      select:{
        id: true
      }
    })

    if(!asiento || !cuenta) throw new Error("No existe cuenta o asiento al cual cargar datos")

    
    
  })
}

export default generateAsientoDetalle