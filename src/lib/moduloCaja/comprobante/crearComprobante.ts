import { fetchPlus } from "@/lib/verificarApiResponse";

export type ComprobanteCreate = {
  concepto: string;
  monto: number;
  userId:string;
  movimientoId: string;
}

export default async function crearComprobante({ concepto, monto, userId, movimientoId }: ComprobanteCreate) {
  
  const server_url = process.env.URL;
  const url = server_url || "";
  
  return await fetchPlus(`${url}/api/comprobante`, {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      concepto,
      monto,
      userId,
      movimientoId
    }),
    method: "POST",
  });
}