import { CuentaBancariaAndBanco } from "@/lib/definitions";

interface Props extends CuentaBancariaAndBanco {
  verSaldo: boolean;
}

const BankAccount: React.FC<Props> = ({
  id,
  numeroCuenta,
  esCuentaAhorro,
  banco,
  saldo,
  saldoDisponible,
  verSaldo,
}) => {
  const tipoDeCuenta = esCuentaAhorro ? "Cuenta de ahorro" : "Cuenta Corriente";
  const saldoFormateado = saldo;

  return (
    <div className="bg-gray-800 py-6 px-4 rounded-md shadow-md [min-width:300px]">
      <h2 className="text-lg font-bold">{banco.nombre}</h2>
      <p className="text-sm"> N° de cuenta {numeroCuenta}</p>
      <p className="text-sm"> {tipoDeCuenta}</p>
      <div className="flex flex-row-reverse justify-between items-center pt-4 w-full">
        <p className="text-xl"> {Number(saldoFormateado).toLocaleString("es-PY")}GS</p>
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
