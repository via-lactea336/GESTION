import React from 'react';

interface ResumenDeCajaProps {
  estado: string;
  cajaInicial: number;
  dineroEnCaja: number;
  diferencia: number;
  fecha: string; 
  caja:string;
}

const ResumenDeCaja: React.FC<ResumenDeCajaProps> = ({ estado, cajaInicial, dineroEnCaja, diferencia,fecha,caja }) => {
  return (
    <div className="mb-6 bg-gray-700 shadow-lg p-6 ">
    <h2 className=" mb-4 font-bold">Resumen de Caja</h2>
    <div className="flex space-x-8 mb-4">
        <p className=" text-white">Fecha: {fecha}</p> 
        <p className=" text-white">Caja: {caja}</p>
      </div>
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
