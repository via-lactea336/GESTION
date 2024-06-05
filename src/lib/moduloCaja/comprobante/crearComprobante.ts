import { fetchPlus } from "@/lib/verificarApiResponse";

export type CrearComprobante = {
  
}

export default async function crearComprobante({

}){
  return fetchPlus('/api/comprobante', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}