import { Factura, Movimiento } from "@prisma/client"
import prisma from "@/lib/prisma"
import ApiError from "@/lib/api/ApiError"

const pagarFactura = async (movimiento:Movimiento & {factura:Factura}) => {
  
  if(!movimiento.factura || !movimiento.facturaId) throw new ApiError("La factura no existe", 404)

  const pagado = movimiento.factura.totalSaldoPagado.plus(movimiento.monto).lessThanOrEqualTo(movimiento.factura.total)
  
  if(!pagado) throw new ApiError("Lo pagado no puede superar el total de la factura", 400)

  const facturas = await prisma.factura.update({
      where:{
        id:movimiento.facturaId
      },
      data:{
        totalSaldoPagado: {
          increment: movimiento.monto
        },
        pagado: new Date(),
      }
    })

    if(!facturas) throw new ApiError("Error al pagar la factura", 500)
    if(facturas.totalSaldoPagado.greaterThan(facturas.total)) throw new ApiError("Lo pagado no puede superar el total de la factura", 400)
    
    return facturas
}

export default pagarFactura