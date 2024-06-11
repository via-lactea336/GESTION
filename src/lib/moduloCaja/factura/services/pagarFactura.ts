import { Factura } from "@prisma/client"
import prisma from "@/lib/prisma"
import ApiError from "@/lib/api/ApiError"
import { Decimal } from "@prisma/client/runtime/library"

const pagarFactura = async (facturaId:string, totalPagado:Decimal, totalFactura:Decimal, monto:Decimal) => {
  
  const nuevoMonto = totalPagado.plus(monto)
  
  if(nuevoMonto.greaterThan(totalFactura)) throw new ApiError("Lo pagado no puede superar el total de la factura", 400)

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

    if(!facturas) throw new ApiError("Error al pagar la factura", 500)
    if(facturas.totalSaldoPagado.greaterThan(facturas.total)) throw new ApiError("Lo pagado no puede superar el total de la factura", 400)
    
    return facturas
}

export default pagarFactura