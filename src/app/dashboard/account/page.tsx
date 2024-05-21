"use client";
import React, { useState, useEffect, useCallback } from "react";
import Header from "@/components/dashboard/account/Header";
import BankAccount from "@/components/dashboard/account/BankAccount";
import obtenerCuentaBancaria from "@/lib/cuentaBancaria/obtenerCuentaBancaria";
import { CuentaBancariaAndBanco } from "@/lib/definitions";

export default function Page() {
  const [cuentasOriginales, setCuentasOriginales] = useState<
    CuentaBancariaAndBanco[]
  >([]);
  const [cuentasFiltradas, setCuentasFiltradas] = useState<
    CuentaBancariaAndBanco[]
  >([]);
  const [bancoSeleccionado, setBancoSeleccionado] = useState<string | null>(
    null
  );
  const [tipoCuentaSeleccionado, setTipoCuentaSeleccionado] = useState<
    string | null
  >(null);
  const [verSaldo, setVerSaldo] = useState<boolean>(false);

  const obtenerCuentas = useCallback(async () => {
    try {
      const cuentasData = await obtenerCuentaBancaria();
      if (
        cuentasData != undefined &&
        typeof cuentasData !== "string" &&
        cuentasData.data != undefined &&
        typeof cuentasData.data !== "string"
      ) {
        setCuentasOriginales(cuentasData.data);
      }
    } catch (error) {
      console.error("Error al obtener las cuentas:", error);
    }
  }, []);

  useEffect(() => {
    obtenerCuentas();
  }, [obtenerCuentas]);

  useEffect(() => {
    // Filtrar cuentas originales según los filtros seleccionados
    let cuentasFiltradasTemp = [...cuentasOriginales];

    if (bancoSeleccionado && bancoSeleccionado !== "Todos") {
      cuentasFiltradasTemp = cuentasFiltradasTemp.filter(
        (cuenta) => cuenta.bancoId === bancoSeleccionado
      );
    }

    if (tipoCuentaSeleccionado && tipoCuentaSeleccionado !== "Todos") {
      cuentasFiltradasTemp = cuentasFiltradasTemp.filter(
        (cuenta) =>
          cuenta.esCuentaAhorro ===
          (tipoCuentaSeleccionado === "Cuenta de ahorro")
      );
    }

    // Establecer las cuentas filtradas en el estado
    setCuentasFiltradas(cuentasFiltradasTemp);
  }, [bancoSeleccionado, tipoCuentaSeleccionado, cuentasOriginales]);

  return (
    <div className="flex flex-col h-full -mt-8">
      <Header
        onBancoSeleccionado={setBancoSeleccionado}
        onTipoCuentaSeleccionado={setTipoCuentaSeleccionado}
        onVerSaldo={setVerSaldo}
      />
      <div className="bg-gray-700 mt-2 rounded-md">
        <div className="grid flex-wrap p-6 gap-4 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
          {cuentasFiltradas.map((cuenta) => (
            <BankAccount
              bancoId={cuenta.bancoId}
              entidadId={cuenta.entidadId}
              key={cuenta.id}
              id={cuenta.id}
              numeroCuenta={cuenta.numeroCuenta}
              esCuentaAhorro={cuenta.esCuentaAhorro}
              banco={cuenta.banco}
              saldo={cuenta.saldo}
              saldoDisponible={cuenta.saldoDisponible}
              verSaldo={verSaldo}
              deleted={cuenta.deleted} createdAt={new Date()} updatedAt={new Date()}            />
          ))}
        </div>
      </div>
    </div>
  );
}