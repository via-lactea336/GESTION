import ApiError from "@/lib/api/ApiError";
import { Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export default async function pagarFactura(tx:Prisma.TransactionClient, facturaSaldoPagado:Decimal, facturaTotal:Decimal, facturaId:string, monto:Decimal){
    
    
  const nuevoMonto = facturaSaldoPagado.plus(monto)
  
  const facturas = await tx.factura.update({
      where:{
        id:facturaId
      },
      data:{
        totalSaldoPagado: {
          increment: monto
        },
        pagado: nuevoMonto.equals(facturaTotal) ? new Date() : null,
      }
    })
  
    if(!facturas) throw new ApiError("Error al pagar la factura", 500)
    if(facturas.totalSaldoPagado.greaterThan(facturas.total)) throw new ApiError("Lo pagado no puede superar el total de la factura", 400)
    
    return facturas
}