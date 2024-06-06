import { fetchPlus } from "@/lib/verificarApiResponse";
import { Factura } from "@prisma/client";

export default async function obtenerFacturaPorId(id:string){
    const server_url = process.env.URL;
    const url = server_url || "";

    try{
        return await fetchPlus<Factura>(`${url}/api/factura/${id}`)
    }catch(error){
        throw new Error("Error al obtener la facturas")
    }
}