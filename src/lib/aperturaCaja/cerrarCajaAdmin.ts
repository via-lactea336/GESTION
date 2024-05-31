import { fetchPlus } from "../verificarApiResponse"

const cerrarCajaAdmin = async (cajaId:string, aperturaId:string) => {
  return await fetchPlus(`http://localhost:3000/api/caja/${cajaId}/cerrar`, {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      aperturaId
    }),
    method: "PUT",
  })
}
export default cerrarCajaAdmin