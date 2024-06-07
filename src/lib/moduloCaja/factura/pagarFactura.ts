import prisma from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";

export default async function pagarFactura(facturaId:string, monto:Decimal){

  return await prisma.$transaction(async (tx)=>{

    const facturas = await tx.factura.update({
      where:{
        id:facturaId
      },
      data:{
        totalSaldoPagado: {
          increment: monto
        }
      }
    })

    if(!facturas) throw new Error("Error al pagar la factura")
    
    if(facturas.totalSaldoPagado.greaterThan(facturas.total)) throw new Error("Lo pagado no puede superar el total de la factura")

    return facturas
    
  })

}