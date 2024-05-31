import Cookies from "js-cookie";

export const obtenerCookie = (nombre: string) => {
  const datos = Cookies.get(nombre);
  if (datos) {
    return JSON.parse(datos);
  }
};
