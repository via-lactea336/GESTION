import { fetchPlus } from "../../verificarApiResponse";

const cerrarCajaAdmin = async (
  cajaId: string,
  aperturaId: string,
  observaciones: string,
  username: string,
  password: string
) => {
  const server_url = process.env.URL;
  const url = server_url || "";
  return await fetchPlus(`${url}/api/caja/${cajaId}/cerrar`, {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      aperturaId,
      observaciones,
      username,
      password
    }),
    method: "PUT",
  });
};
export default cerrarCajaAdmin;
