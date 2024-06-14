import { useState, useEffect } from "react";
import { Cajero, CajaData } from "../definitions";
import { obtenerCookie } from "../obtenerCookie";
import { AperturaCaja, User } from "@prisma/client";

export default function useCookies() {
  const [cajero, setCajero] = useState<Cajero>();
  const [caja, setCaja] = useState<CajaData>();
  const [apertura, setApertura] = useState<AperturaCaja>();
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cajero = obtenerCookie("cajero");
    const caja = obtenerCookie("caja");
    const apertura = obtenerCookie("apertura");
    const usuario = obtenerCookie("user");
    if (cajero) {
      setCajero(cajero);
    }
    if (caja) {
      setCaja(caja);
    }
    if (apertura) {
      setApertura(apertura);
    }
    if (usuario) {
      setUser(usuario);
    }
    setLoading(false);
  }, []);

  return { cajero, caja, apertura, user, loading };
}
