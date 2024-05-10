"use client"
import React, { useState, useEffect } from "react";
import Header from "@/components/dashboard/account/Header";
import BankAccount from "@/components/dashboard/account/BankAccount";
import obtenerCuentaBancaria from "@/lib/cuentaBancaria/obtenerCuentaBancaria";
import { CuentaBancaria } from "@prisma/client";
export default function Page() {
  const [cuentas, setCuentas] = useState<CuentaBancaria[]>([]);
  const [bancoSeleccionado, setBancoSeleccionado] = useState<string | null>(null);

  useEffect(() => {
    obtenerYMostrarCuentas();
  }, [bancoSeleccionado]);

  const obtenerYMostrarCuentas = async () => {
    try {
      const cuentasData = await obtenerCuentaBancaria();
     
      if(cuentasData != undefined && typeof(cuentasData) != "string" && cuentasData.data != undefined && typeof(cuentasData.data) != "string") {
      console.log(bancoSeleccionado)
      let cuentasFiltradas = cuentasData.data;

    if (bancoSeleccionado) {
      cuentasFiltradas = cuentasData.data?.filter((cuenta) => cuenta.bancoId === bancoSeleccionado) ?? cuentasData.data;
    }

    setCuentas(cuentasFiltradas);}

     
    } catch (error) {
      console.error("Error al obtener las cuentas:", error);
    }
  };

  return (
    <div className="flex flex-col h-full -mt-8">
         <Header onBancoSeleccionado={setBancoSeleccionado} />

      <div className="bg-primary-200 container mx-auto mt-2 rounded-md">
        <h1 className="text-4xl font-bold text-center pt-3 text-primary-900">
          Cuentas
        </h1>
        <div className="flex items-center justify-center py-6 flex-wrap gap-4 md:gap-8">
        {cuentas.map((cuenta: CuentaBancaria) => (
            <BankAccount
              key={cuenta.id}
              id={cuenta.id}
              numeroCuenta={cuenta.numeroCuenta}
              esCuentaAhorro={cuenta.esCuentaAhorro}
              bancoId={cuenta.bancoId}
              saldo={cuenta.saldo}
              saldoDisponible={cuenta.saldoDisponible}
            />
          ))}
        </div>
      </div>
    </div>
  );
}