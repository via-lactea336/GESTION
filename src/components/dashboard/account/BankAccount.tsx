"use client";
import { Banco } from "@prisma/client";
import { useEffect, useState } from "react";
import obtenerBancoPorId from "@/lib/banco/obtenerBancoPorId";

interface CuentaBancaria {
  id: string;
  numeroCuenta: string;
  esCuentaAhorro: boolean;
  bancoId: string;
  saldo: number;
  saldoDisponible: number;
  verSaldo: boolean;
}

const BankAccount: React.FC<CuentaBancaria> = ({
  id,
  numeroCuenta,
  esCuentaAhorro,
  bancoId,
  saldo,
  saldoDisponible,
  verSaldo,
}) => {
  const tipoDeCuenta = esCuentaAhorro ? "Cuenta de ahorro" : "Cuenta Corriente";
  const saldoFormateado = saldo.toLocaleString();
  const estadoInicial = { id: "", nombre: "" };

  const obtenerYMostrarBanco = async () => {
    try {
      const cuentasData = await obtenerBancoPorId(bancoId);

      if (cuentasData === undefined || typeof cuentasData === "string") return;

      setBanco(cuentasData.data ?? estadoInicial);
    } catch (error) {
      console.error("Error al obtener las cuentas:", error);
    }
  };

  const [banco, setBanco] = useState<Banco>(estadoInicial);
  useEffect(() => {
    obtenerYMostrarBanco();
  }, []);

  return (
    <div className="bg-gray-800 py-6 px-4 rounded-md shadow-md [min-width:300px]">
      <h2 className="text-lg font-bold">{tipoDeCuenta}</h2>
      <p className="text-sm"> N° de cuenta {numeroCuenta}</p>
      <p className="text-sm"> {banco.nombre}</p>
      <div className="flex flex-row-reverse justify-between items-center pt-4 w-full">
        <p className="text-xl">
          {" "}
          {verSaldo
            ? saldoFormateado
            : `${"*".repeat(saldoFormateado.length)}`}{" "}
          GS
        </p>
        <a
          href={`/dashboard/account/${id}`}
          className="bg-primary-700 text-white py-2 px-2 text-sm rounded-md hover:bg-primary-600"
        >
          Ver Detalles
        </a>
      </div>
    </div>
  );
};

export default BankAccount;
