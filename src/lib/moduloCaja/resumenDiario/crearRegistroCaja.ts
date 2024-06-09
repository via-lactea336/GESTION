import { fetchPlus } from "@/lib/verificarApiResponse";

export default async function crearRegistroCaja(
  aperturaId: string,
){
  const server_url = process.env.URL;
  const url = server_url || "";
  return await fetchPlus(`${url}/api/registro-caja/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ aperturaId }),
  });
}