import { ApiResponseData } from "@/lib/definitions";

export default async function crearFacturaDetalle({
  facturaId,
  productoId,
  costoUnit,
  cantidad, 
  monto,
  iva,
  ivaPorcent,
}:{
  facturaId:string,
  productoId:string,
  clienteId:string,
  costoUnit:number,
  cantidad:number,
  monto:number,
  iva?:number,
  ivaPorcent:number
}){
  const server_url = process.env.URL;
  const url = server_url || "";
  try {
    const aperturaCaja = await fetch(`${url}/api/factura-detalle`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        facturaId,
        productoId,
        costoUnit,
        cantidad, 
        monto,
        iva: iva || null,
        ivaPorcent,
      }),
    });
    const data: ApiResponseData = await aperturaCaja.json();
    if (data.error) throw new Error(data.error);
    return data;
  } catch (err) {
    if (err instanceof Error) return err.message;
  }
}