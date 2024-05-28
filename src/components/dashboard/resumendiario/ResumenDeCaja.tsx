import React from 'react';

interface ResumenDeCajaProps {
  estado: string;
  cajaInicial: number;
  dineroEnCaja: number;
  diferencia: number;
  fecha: string; 
}

const ResumenDeCaja: React.FC<ResumenDeCajaProps> = ({ estado, cajaInicial, dineroEnCaja, diferencia,fecha }) => {
  return (
    <div className="mb-6 bg-gray-700 shadow-lg p-6 ">
    <h2 className=" mb-4 font-bold">Resumen de Caja</h2>
    <p className="mb-2 text-sm text-withe">Fecha: {fecha}</p> {/* Aquí se muestra la fecha */}
      <table className="border-collapse border border-black table-auto mx-auto w-full">
        
        <tbody>
          <tr>
          <td className="p-2">Estado</td>
        <td className="p-2">{estado}</td>
      </tr>
      <tr>
        <td className="p-2">Caja Inicial</td>
        <td className="p-2">{cajaInicial}</td>
      </tr>
      <tr>
        <td className="p-2">Dinero en Caja</td>
        <td className="p-2">{dineroEnCaja}</td>
      </tr>
      <tr>
        <td className="p-2">Diferencia</td>
        <td className="p-2">{diferencia}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ResumenDeCaja;
