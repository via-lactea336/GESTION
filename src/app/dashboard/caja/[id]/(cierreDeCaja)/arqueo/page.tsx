"use client";
import InputCalendar from "@/components/global/InputCalendar";
import React, { useState, useEffect, useCallback } from "react";

export default function Page() {
  const datos = {
    caja: {
      nombreCaja: "Caja1",
      numeroCaja: 3,
      esActiva: false,
    },
    nombreCuenta: "Pablo Escobar",
    numeroArqueo: 2,
    fecha: "23-05-2024",
  };

  return (
    <div>
      <div className="p-10 -mt-7 bg-primary-800">
        <div className="flex flex-row ">
          <h1 className="text-3xl font-bold mt-2 mb-2">Arqueo de caja</h1>
          <p className="ml-auto font-bold mt-4 mb-2">
            vendedor : {datos.nombreCuenta}
          </p>
          <p className="font-bold mt-4 mb-2 ml-10">
            N° Caja : {datos.caja.numeroCaja}
          </p>
        </div>
        <div className="flex justify-between mt-5">
          <div>
            <h1>Arqueo N° : {datos.numeroArqueo}</h1>
            <h1 className="mt-3">Fecha del Arqueo : {datos.fecha}</h1>
          </div>
          <div>
            <h1>N° Cajero : 3</h1>
            <h1 className="mt-3">Estacion :</h1>
          </div>
          <div>
            <div className="flex flex-row">
              <h1>Fecha desde</h1>
              <InputCalendar
                id="fechaMin"
                className="bg-gray-800 text-white py-1 px-2 rounded-md ml-5"
              />
            </div>
            <div className="flex flex-row">
              <h1 className="mt-3">Fecha hasta</h1>
              <InputCalendar
                id="fechaMin"
                className="bg-gray-800 text-white py-1 px-2 rounded-md ml-6 mt-3"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="text-white flex flex-row mt-10">
        <div className="bg-primary-500 flex flex-col p-5 rounded-md mb-auto">
          <h1 className="text-center text-xl">Según Cajero</h1>
          <div className="m-5 flex justify-between">
            <label>Fondo de Caja</label>
            <input type="text" className="ml-10 rounded-md bg-gray-600" />
          </div>

          <div className="m-5 flex justify-between">
            <label>Efectivo</label>
            <input type="text" className="ml-10 rounded-md bg-gray-600" />
          </div>

          <div className="m-5 flex justify-between">
            <label>Cheque</label>
            <input type="text" className="ml-10 rounded-md bg-gray-600" />
          </div>

          <div className="m-5 flex justify-between">
            <label>Tarjeta de Crédito</label>
            <input type="text" className="ml-10 rounded-md bg-gray-600" />
          </div>

          <div className="m-5 flex justify-between">
            <label>Tarjeta de Débito</label>
            <input type="text" className="ml-10 rounded-md  bg-gray-600" />
          </div>

          <div className="m-5 flex justify-between">
            <label>Total Ingresos</label>
            <input type="text" className="ml-10 rounded-md" />
          </div>

          <button className="bg-gray-800 ml-10 mt-5 mr-10 pt-3 pb-3">
            GUARDAR
          </button>
        </div>

        <div className="ml-auto">
          <table className="text-center text-white min-w-[600px]">
            <thead className="bg-primary-700 text-black">
              <tr>
                <th className="px-4 py-2">Denominacion</th>
                <th className="px-4 py-2">Cantidad</th>
                <th className="px-4 py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-gray-700 text-gray-200">
                <td className="px-4 py-2">
                  <div className="my-2">BILLETE 2.000</div>
                </td>
                <td className="px-4 py-2">
                  <input type="number" name="" id="" className="bg-gray-700" />
                </td>
                <td className="px-4 py-2">
                  <div className="my-2"></div>
                </td>
              </tr>
              <tr className="bg-gray-700 text-gray-200">
                <td className="px-4 py-2">
                  <div className="my-2">BILLETE 5.000</div>
                </td>
                <td className="px-4 py-2">
                  <input type="number" name="" id="" className="bg-gray-700" />
                </td>
                <td className="px-4 py-2">
                  <div className="my-2"></div>
                </td>
              </tr>
              <tr className="bg-gray-700 text-gray-200">
                <td className="px-4 py-2">
                  <div className="my-2">BILLETE 10.000</div>
                </td>
                <td className="px-4 py-2">
                  <input type="number" name="" id="" className="bg-gray-700" />
                </td>
                <td className="px-4 py-2">
                  <div className="my-2"></div>
                </td>
              </tr>
              <tr className="bg-gray-700 text-gray-200">
                <td className="px-4 py-2">
                  <div className="my-2">BILLETE 20.000</div>
                </td>
                <td className="px-4 py-2">
                  <input type="number" name="" id="" className="bg-gray-700" />
                </td>
                <td className="px-4 py-2">
                  <div className="my-2"></div>
                </td>
              </tr>
              <tr className="bg-gray-700 text-gray-200">
                <td className="px-4 py-2">
                  <div className="my-2">BILLETE 50.000</div>
                </td>
                <td className="px-4 py-2">
                  <input type="number" name="" id="" className="bg-gray-700" />
                </td>
                <td className="px-4 py-2">
                  <div className="my-2"></div>
                </td>
              </tr>
              <tr className="bg-gray-700 text-gray-200">
                <td className="px-4 py-2">
                  <div className="my-2">BILLETE 100.000</div>
                </td>
                <td className="px-4 py-2">
                  <input type="number" name="" id="" className="bg-gray-700" />
                </td>
                <td className="px-4 py-2">
                  <div className="my-2"></div>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="ml-20 mr-20">
            <div className="mt-10 flex justify-between">
              <label>TOTAL BILLETES</label>
              <input type="number" className="rounded-md" />
            </div>

            <div className="mt-10 flex justify-between">
              <label>TOTAL MONEDAS</label>
              <input type="number" className="rounded-md" />
            </div>

            <div className="mt-10 flex justify-between">
              <label>TOTAL</label>
              <input type="number" className="rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
