import Cookies from "js-cookie";

export const obtenerCookie = (nombre: "apertura" | "caja" | "cajero") => {
  const datos = Cookies.get(nombre);
  if (datos) {
    return JSON.parse(datos);
  }
};
