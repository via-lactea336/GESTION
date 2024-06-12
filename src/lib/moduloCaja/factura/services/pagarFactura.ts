import { Factura } from "@prisma/client"
import prisma from "@/lib/prisma"
import ApiError from "@/lib/api/ApiError"
import { Decimal } from "@prisma/client/runtime/library"

const pagarFactura = async (facturaId:string, totalPagado:Decimal, totalFactura:Decimal, monto:Decimal) => {
  
  const nuevoMonto = totalPagado.plus(monto)
  
  const facturas = await prisma.factura.update({
      where:{
        id:facturaId
      },
      data:{
        totalSaldoPagado: {
          increment: monto
        },
        pagado: nuevoMonto.equals(totalFactura) ? new Date() : null,
      }
    })
    
    return facturas
}

export default pagarFactura