import React from 'react'
import Image from 'next/image'

type StepProps = {
  nextStep: () => void;
};

const Step1: React.FC<StepProps> = ({ nextStep }) => {
  return (
    <div className="proceso">
      <h2 className="text-2xl font-bold my-4">Ingresos</h2>
      <div className="flex justify-between align-center bg-gray-600 rounded px-3">
        <div className="flex flex-col my-2">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-bold">Fecha de operación:</label>
            <input type="text" value="26/05/2024" className="ml-2 p-1 border rounded w-48" readOnly />
          </div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-bold">Hora de operación:</label>
            <input type="text" value="14:26" className="ml-2 p-1 border rounded w-48" readOnly />
          </div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-bold">Cajero/a:</label>
            <input type="text" value="11 - Fulana Men..." className="ml-2 p-1 border rounded w-48" readOnly />
          </div>
        </div>
        <div className="flex flex-col my-2">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-bold">Entidad:</label>
            <select className="ml-2 p-1 border rounded w-48">
              <option>Cliente</option>
            </select>
          </div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-bold">Cliente:</label>
            <select className="ml-2 p-1 border rounded w-48">
              <option>05 Ana Britez</option>
            </select>
          </div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-bold">Ruc:</label>
            <input type="text" value="2.369.254" className="ml-2 p-1 border rounded w-48" readOnly />
          </div>
        </div>
        <div>
          <h2 className="text-4xl font-bold mt-2 bg-gray-400 p-4 rounded-sm">125.000 Gs.-</h2>
          <div className="flex justify-between">
            <div className="flex flex-col my-2">
              <div className="flex justify-between items-center mb-2">
                <Image alt="Argentina" className="w-6 h-4" src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Flag_of_Argentina.svg/200px-Flag_of_Argentina.svg.png" width={10} height={8}></Image>
                <span className="ml-2">145.000</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <Image alt="USA" className="w-6 h-4" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCRTGF_zpQvgpXueeXGVYWogwsfwfCxmfckBqJuvH63Q&s" width={10} height={8}></Image>
                <span className="ml-2">145.000</span>
              </div>
            </div>
            <div className="flex flex-col my-2">
              <div className="flex justify-between items-center mb-2">
                <Image alt="Brazil" className="w-6 h-4" src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Brazil.svg/300px-Flag_of_Brazil.svg.png" width={10} height={8}></Image>
                <span className="ml-2">145.000</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <Image alt="EU" className="w-6 h-4" src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/European_flag%2C_incorrect_star_rotation.svg/225px-European_flag%2C_incorrect_star_rotation.svg.png" width={10} height={8}></Image>
                <span className="ml-2">145.000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="my-4">
        <div className="flex justify-between items-center mb-2">
          <input type="text" placeholder="Producto" className="p-1 border rounded w-full" />
          <button className="ml-2 bg-gray-400 text-white px-4 py-2 rounded">AGREGAR</button>
        </div>
        <table className="min-w-full border-collapse border border-gray-400">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Descripción</th>
              <th className="border border-gray-300 px-4 py-2">Cantidad</th>
              <th className="border border-gray-300 px-4 py-2">Precio Unitario</th>
              <th className="border border-gray-300 px-4 py-2">Importe</th>
              <th className="border border-gray-300 px-4 py-2">DELETE</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2">16</td>
              <td className="border border-gray-300 px-4 py-2">Shampoo Loreal</td>
              <td className="border border-gray-300 px-4 py-2">1</td>
              <td className="border border-gray-300 px-4 py-2">30.000</td>
              <td className="border border-gray-300 px-4 py-2">30.000</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <button className="text-red-500">X</button>
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">12</td>
              <td className="border border-gray-300 px-4 py-2">Jabón Dove</td>
              <td className="border border-gray-300 px-4 py-2">2</td>
              <td className="border border-gray-300 px-4 py-2">5.000</td>
              <td className="border border-gray-300 px-4 py-2">10.000</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <button className="text-red-500">X</button>
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">23</td>
              <td className="border border-gray-300 px-4 py-2">Aceite capilar</td>
              <td className="border border-gray-300 px-4 py-2">1</td>
              <td className="border border-gray-300 px-4 py-2">20.000</td>
              <td className="border border-gray-300 px-4 py-2">20.000</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <button className="text-red-500">X</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex justify-end">
        <button onClick={nextStep} className="bg-gray-500 text-white py-2 px-4 rounded">Proceder al pago</button>
      </div>
    </div>
  );
};

export default Step1;
