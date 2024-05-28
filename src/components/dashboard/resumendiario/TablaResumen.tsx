import React from "react";

interface TablaResumenProps {
  efectivo: number;
  cheque: number;
  deposito: number;
}

const TablaResumen: React.FC<TablaResumenProps> = ({ efectivo, cheque, deposito }) => {

  const totalIngresos = efectivo + cheque + deposito;
  const totalEgresos = 0; 

  return (
    <div className="mb-6 bg-gray-700 shadow-lg p-6">
      <h2 className=" mb-4 font-bold">Resumen de ingresos y egresos por forma de pago</h2>

      <table className="border-collapse border border-black table-auto mx-auto text-center w-full">
        <thead>
          <tr>
            <th className="p-2 w-1/5">Forma de Pago</th>
            <th className="p-2 w-1/5">Transacciones</th>
            <th className="p-2 w-1/5">Ingreso</th>
            <th className="p-2 w-1/5">Egreso</th>
            <th className="p-2 w-1/5">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2">Efectivo</td>
            <td className="p-2">0</td> {/* Cantidad de transacciones, si corresponde */}
            <td className="p-2">{efectivo}</td>
            <td className="p-2">0</td> {/* Egresos en efectivo, si corresponde */}
            <td className="p-2">{efectivo}</td>
          </tr>
          <tr>
            <td className="p-2">Cheque</td>
            <td className="p-2">0</td> {/* Cantidad de transacciones, si corresponde */}
            <td className="p-2">{cheque}</td>
            <td className="p-2">0</td> {/* Egresos en cheque, si corresponde */}
            <td className="p-2">{cheque}</td>
          </tr>
          <tr>
            <td className="p-2">Deposito a cuenta</td>
            <td className="p-2">0</td> {/* Cantidad de transacciones, si corresponde */}
            <td className="p-2">{deposito}</td>
            <td className="p-2">0</td> {/* Egresos en depósito, si corresponde */}
            <td className="p-2">{deposito}</td>
          </tr>
          
        </tbody>
      </table>
    </div>
  );
};

export default TablaResumen;
