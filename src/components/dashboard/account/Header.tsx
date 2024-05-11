/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React from "react";
import { useEffect, useState } from "react";
import obtenerBancos from "@/lib/banco/obtenerBancos";
import { Banco } from "@prisma/client";

type MenuItem = {
  label: string;
  options: string[];
};

type HeaderProps = {
  onBancoSeleccionado: (bancoId: string) => void;
  onTipoCuentaSeleccionado: (tipoCuenta: string) => void;
  onVerSaldo: (verSaldo: boolean) => void;
};

const Header = ({
  onBancoSeleccionado,
  onTipoCuentaSeleccionado,
  onVerSaldo,
}: HeaderProps) => {
  const estadoInicial = [{ id: "0", nombre: "No hay bancos", deleted: null }];
  const handleBancoSeleccionado = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const bancoId = event.target.value;
    onBancoSeleccionado(bancoId);
  };

  const handleTipoCuentaSeleccionado = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const tipoCuenta = event.target.value;
    onTipoCuentaSeleccionado(tipoCuenta);
  };

  const handleVerSaldo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const verSaldo = event.target.checked;
    onVerSaldo(verSaldo);
  };

  const obtenerYMostrarBanco = async () => {
    try {
      const cuentasData = await obtenerBancos();

      if (cuentasData === undefined || typeof cuentasData === "string") return;

      setBanco(cuentasData.data ?? estadoInicial);
    } catch (error) {
      console.error("Error al obtener las cuentas:", error);
    }
  };

  const [banco, setBanco] = useState<Banco[]>(estadoInicial);
  useEffect(() => {
    obtenerYMostrarBanco();
  }, []);

  const menu: MenuItem[] = [
    {
      label: "Tipo de cta",
      options: ["Todos", "Cuenta Corriente", "Cuenta de ahorro"],
    },
  ];

  return (
    <header className="flex gap-3 justify-between items-center flex-wrap px-8 py-4 w-full rounded-md bg-primary-800 text-white">
      <h1 className="text-2xl font-bold">Cuentas</h1>
      <nav className="flex flex-wrap  items-center gap-6">
        <div className="flex items-center gap-3">
          <h3 className="mr-2">Bancos</h3>
          <select
            className="bg-gray-800 text-white py-1 px-2 rounded-md"
            onChange={handleBancoSeleccionado}
          >
            <option value="Todos">Todos</option>
            {banco.map((data, index) => (
              <option key={index} value={data.id}>
                {data.nombre}
              </option>
            ))}
          </select>
        </div>
        {menu.map((data, index) => (
          <div key={index} className="flex items-center gap-3">
            <h3 className="mr-2">{data.label}</h3>
            <select
              className="bg-gray-800 text-white py-1 px-2 rounded-md"
              onChange={handleTipoCuentaSeleccionado}
            >
              {data.options.map((option, i) => (
                <option key={i}>{option}</option>
              ))}
            </select>
          </div>
        ))}
        <div className="flex items-center gap-3">
          <h3>Ver saldos</h3>
          <input
            onChange={handleVerSaldo}
            defaultChecked={false}
            type="checkbox"
            className="h-4 w-4 accent-primary-500 cursor-pointer"
          />
        </div>
      </nav>
    </header>
  );
};

export default Header;
