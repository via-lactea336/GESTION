import React, { useState } from 'react';

type Step2Props = {
  nextStep: () => void;
  prevStep: () => void;
}

const Step2: React.FC<Step2Props> = ({ nextStep, prevStep }) => {
  return (
    <div>
      <div className="proceso">
        <h2 className="text-2xl font-bold my-4">Pago</h2>
        <div className="flex justify-between align-center rounded px-3">
          <div className="flex flex-col my-2">
            <label className="text-sm font-bold mb-2">Seleccionar método de pago:</label>
            <div className="flex items-center">
              <select className="border px-4 py-2 rounded ml-2">
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta de Crédito</option>
                <option value="cheque">Cheque</option>
              </select>
              <button className="bg-gray-400 text-white px-4 py-2 rounded ml-2">Agregar nuevo método</button>
            </div>
          </div>
          <div className="flex flex-row my-2">
            <div className="flex flex-col mx-4 justify-between">
              <label className="text-sm font-bold mb-2">Tipo de Pago:</label>
              <div className="flex items-center mb-2">
              <input
                  type="radio"
                  id="contado"
                  name="paymentType"
                  className="mr-2"
                  value="contado"
                />
                <label htmlFor="contado" className="mr-4">Contado</label>
                <input
                  type="radio"
                  id="credito"
                  name="paymentType"
                  className="mr-2"
                  value="credito"
                />
                <label htmlFor="credito">Crédito</label>
              </div>
            </div>
            <div className="flex flex-col ml-4">
              <label className="text-sm font-bold mb-2">Número de cuotas:</label>
              <select className="border px-4 py-2 rounded ml-2">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </div>
          </div>
        </div>
        <div className="my-4">
          <table className="min-w-full border-collapse border border-gray-400">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">ID</th>
                <th className="border border-gray-300 px-4 py-2">MÉTODO</th>
                <th className="border border-gray-300 px-4 py-2">DETALLE</th>
                <th className="border border-gray-300 px-4 py-2">IMPORTE</th>
                <th className="border border-gray-300 px-4 py-2">DELETE</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">02</td>
                <td className="border border-gray-300 px-4 py-2">Efectivo</td>
                <td className="border border-gray-300 px-4 py-2">-</td>
                <td className="border border-gray-300 px-4 py-2">60.000</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button className="text-red-500">X</button>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">04</td>
                <td className="border border-gray-300 px-4 py-2">Tarjeta de Crédito</td>
                <td className="border border-gray-300 px-4 py-2">VISA ITAÚ</td>
                <td className="border border-gray-300 px-4 py-2">40.000</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button className="text-red-500">X</button>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">07</td>
                <td className="border border-gray-300 px-4 py-2">Cheque</td>
                <td className="border border-gray-300 px-4 py-2">H739H</td>
                <td className="border border-gray-300 px-4 py-2">25.000</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button className="text-red-500">X</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className='flex justify-between'>
          <div className="border border-gray-300 px-4 py-2 text-right font-bold">
            <h2>Total: 125.000 Gs.-</h2>
          </div>
          <div className="flex justify-end">
            <button onClick={prevStep} className="bg-gray-500 text-white py-2 px-4 ml-2 rounded">Volver</button>
            <button onClick={nextStep} className="bg-gray-500 text-white py-2 px-4 ml-2 rounded">Ver Resumen</button>
          </div>
        </div>        
      </div>
    </div>
  );
};

export default Step2;