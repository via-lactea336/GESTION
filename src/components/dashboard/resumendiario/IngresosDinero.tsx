import React from "react";
interface IngresosDineroProps {
    efectivo: number,
    deposito: number,
  
  }
  const IngresosDinero: React.FC<IngresosDineroProps> = ({ efectivo,deposito}) => {
      return (
        <div className="mb-6 bg-gray-700 shadow-lg p-6">
          <h2 className=" mb-4 font-bold">Ingresos de Dinero</h2>
          <table className="border-collapse border border-black table-auto mx-auto w-full">
            
            <tbody>
              <tr>
              <td className="p-2">Efectivo</td>
            <td className="p-2">{efectivo}</td>
          </tr>
          <tr>
            <td className="p-2">Deposito</td>
            <td className="p-2">{deposito}</td>
          </tr>
         
            </tbody>
          </table>
        </div>
      );
    }
    
    export default IngresosDinero;
  
  