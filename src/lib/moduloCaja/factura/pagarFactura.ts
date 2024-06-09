import ApiError from "@/lib/api/ApiError";
import { Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export default async function pagarFactura(tx:Prisma.TransactionClient, facturaSaldoPagado:Decimal, facturaTotal:Decimal, facturaId:string, monto:Decimal){
    
  const pagado = facturaSaldoPagado.plus(monto).equals(facturaTotal)

  const facturas = await tx.factura.update({
      where:{
        id:facturaId
      },
      data:{
        totalSaldoPagado: {
          increment: monto
        },
        pagado: pagado
      }
    })

    if(!facturas) throw new ApiError("Error al pagar la factura", 500)
    if(facturas.totalSaldoPagado.greaterThan(facturas.total)) throw new ApiError("Lo pagado no puede superar el total de la factura", 400)
    
    return facturas
}