"use client";
import InputCalendar from "@/components/global/InputCalendar";
import React, { useState, useEffect } from "react";
import { Modal } from "@/components/global/Modal";
import FormArqueo from "@/components/cajaVentanasEmergentes/FormArqueo";

export default function Page() {
  const [denominaciones, setDenominaciones] = useState({
    moneda500 : 0,
    moneda1000 : 0,
    billete2000 : 0,
    billete5000 : 0,
    billete10000 : 0,
    billete20000 : 0,
    billete50000 : 0,
    billete100000 : 0
  })

  const [totales, setTotales] = useState({
    fondoCaja: 0,
    totalEfectivo: 0,
    totalCheque: 0,
    totalTarjetaDebito: 0,
    totalTarjetaCredito: 0,
    montoTotal: 0
  })
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

  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowModal(true);
    setSelectedId(e.currentTarget.id);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setDenominaciones({
      ...denominaciones,
      [name]: value,
    });
  };

  const handleChangeTotales = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setTotales({
      ...totales,
      [name]: value,
    });
  };

  useEffect(() => {
    let total = 0;
    let monto = 0;
    total += denominaciones.moneda500 * 500;
    total += denominaciones.moneda1000 * 1000;
    total += denominaciones.billete2000 * 2000;
    total += denominaciones.billete5000 * 5000;
    total += denominaciones.billete10000 * 10000;
    total += denominaciones.billete20000 * 20000;
    total += denominaciones.billete50000 * 50000;
    total += denominaciones.billete100000 * 100000;

    monto += totales.totalCheque * 1;
    monto += totales.totalTarjetaCredito * 1;
    monto += totales.totalTarjetaDebito * 1;
    monto += total * 1;
    setTotales({
      ...totales,
      ["totalEfectivo"] : total,
      ["montoTotal"]: monto
    })
  }, [denominaciones]);

  return (
    <div>
      <div className="p-10 -mt-7 bg-primary-800" >
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
      <div className={
          showModal ? "blur-sm brightness-50 text-white flex flex-row mt-10" : "text-center text-white text-white flex flex-row mt-10"
        }>
        <div className="bg-primary-500 flex flex-col p-5 rounded-md mb-auto">
          <h1 className="text-center text-xl">Según Cajero</h1>
          <div className="m-5 flex justify-between">
            <label>Fondo de Caja</label>
            <input type="number" value={totales.fondoCaja} 
              className="ml-10 rounded-md bg-gray-600 text-center"
              name="fondoCaja" 
              onChange={handleChangeTotales}
            />
          </div>

          <div className="m-5 flex justify-between">
            <label>Efectivo</label>
            <div className="ml-10 rounded-md bg-gray-600 min-w-[195px] text-center">
              {totales.totalEfectivo.toLocaleString('de-DE')}
            </div>
          </div>

          <div className="m-5 flex justify-between">
            <label>Cheque</label>
            <input type="number" value={totales.totalCheque} 
              className="ml-10 rounded-md bg-gray-600 text-center" 
              name="totalCheque" 
              onChange={handleChangeTotales}
            />
          </div>

          <div className="m-5 flex justify-between">
            <label>Tarjeta Crédito</label>
            <input type="number" value={totales.totalTarjetaCredito} 
              className="ml-10 rounded-md bg-gray-600 text-center" 
              name="totalTarjetaCredito" 
              onChange={handleChangeTotales}
            />
          </div>

          <div className="m-5 flex justify-between">
            <label>Tarjeta Débito</label>
            <input type="number" value={totales.totalTarjetaDebito} 
              className="ml-10 rounded-md  bg-gray-600 text-center" 
              name="totalTarjetaDebito" 
              onChange={handleChangeTotales}
            />
          </div>

          <div className="m-5 flex justify-between">
            <label>Total Ingresos</label>
            <div className="ml-10 rounded-md bg-gray-600 min-w-[195px] text-center">
              {totales.montoTotal.toLocaleString('de-DE')}
            </div>
          </div>

          <button className="bg-gray-800 ml-10 mt-5 mr-10 pt-3 pb-3" onClick={handleClick}>
            REALIZAR CIERRE
          </button>
        </div>

        <div className="ml-auto">
          <table className="text-center text-white min-w-[400px] ml-10">
            <thead className="bg-primary-700 text-black">
              <tr>
                <th className="px-4 py-2 min-w-[190px]">Denominacion</th>
                <th className="px-4 py-2 min-w-[190px]">Cantidad</th>
                <th className="px-4 py-2 min-w-[190px]">Total</th>
              </tr>
            </thead>
            <tbody>
            <tr className="bg-gray-700 text-gray-200">
                <td className="px-4 py-2">
                  <div className="my-2">MONEDA 500</div>
                </td>
                <td className="px-4 py-2">
                  <input type="number" name="moneda500" 
                    value={denominaciones.moneda500}  
                    className="bg-gray-600 max-w-[100px] rounded-md text-center" 
                    onChange={handleChange}
                  />
                </td>
                <td className="px-4 py-2">
                  <div className="my-2">{(denominaciones.moneda500 * 500).toLocaleString('de-DE')} Gs.</div>
                </td>
              </tr>
              <tr className="bg-gray-700 text-gray-200">
                <td className="px-4 py-2">
                  <div className="my-2">MONEDA 1.000</div>
                </td>
                <td className="px-4 py-2">
                  <input type="number" name="moneda1000" 
                    value={denominaciones.moneda1000}  
                    className="bg-gray-600 max-w-[100px] rounded-md text-center" 
                    onChange={handleChange}
                  />
                </td>
                <td className="px-4 py-2">
                  <div className="my-2">{(denominaciones.moneda1000 * 1000).toLocaleString('de-DE')} Gs.</div>
                </td>
              </tr>
              <tr className="bg-gray-700 text-gray-200">
                <td className="px-4 py-2">
                  <div className="my-2">BILLETE 2.000</div>
                </td>
                <td className="px-4 py-2">
                  <input type="number" name="billete2000" 
                    value={denominaciones.billete2000}  
                    className="bg-gray-600 max-w-[100px] rounded-md text-center" 
                    onChange={handleChange}
                  />
                </td>
                <td className="px-4 py-2">
                  <div className="my-2">{(denominaciones.billete2000 * 2000).toLocaleString('de-DE')} Gs.</div>
                </td>
              </tr>
              <tr className="bg-gray-700 text-gray-200">
                <td className="px-4 py-2">
                  <div className="my-2">BILLETE 5.000</div>
                </td>
                <td className="px-4 py-2">
                  <input type="number" name="billete5000" 
                    value={denominaciones.billete5000}  
                    className="bg-gray-600 max-w-[100px] rounded-md text-center" 
                    onChange={handleChange}
                  />
                </td>
                <td className="px-4 py-2">
                  <div className="my-2">{(denominaciones.billete5000 * 5000).toLocaleString('de-DE')} Gs.</div>
                </td>
              </tr>
              <tr className="bg-gray-700 text-gray-200">
                <td className="px-4 py-2">
                  <div className="my-2">BILLETE 10.000</div>
                </td>
                <td className="px-4 py-2">
                  <input type="number" name="billete10000" 
                    value={denominaciones.billete10000}  
                    className="bg-gray-600 max-w-[100px] rounded-md text-center" 
                    onChange={handleChange}
                  />
                </td>
                <td className="px-4 py-2">
                  <div className="my-2">{(denominaciones.billete10000 * 10000).toLocaleString('de-DE')} Gs.</div>
                </td>
              </tr>
              <tr className="bg-gray-700 text-gray-200">
                <td className="px-4 py-2">
                  <div className="my-2">BILLETE 20.000</div>
                </td>
                <td className="px-4 py-2">
                  <input type="number" name="billete20000" 
                    value={denominaciones.billete20000}  
                    className="bg-gray-600 max-w-[100px] rounded-md text-center" 
                    onChange={handleChange}
                  />
                </td>
                <td className="px-4 py-2">
                  <div className="my-2">{(denominaciones.billete20000 * 20000).toLocaleString('de-DE')} Gs.</div>
                </td>
              </tr>
              <tr className="bg-gray-700 text-gray-200">
                <td className="px-4 py-2">
                  <div className="my-2">BILLETE 50.000</div>
                </td>
                <td className="px-4 py-2">
                  <input type="number" name="billete50000" 
                    value={denominaciones.billete50000}  
                    className="bg-gray-600 max-w-[100px] rounded-md text-center" 
                    onChange={handleChange}
                  />
                </td>
                <td className="px-4 py-2">
                  <div className="my-2">{(denominaciones.billete50000 * 50000).toLocaleString('de-DE')} Gs.</div>
                </td>
              </tr>
              <tr className="bg-gray-700 text-gray-200">
                <td className="px-4 py-2">
                  <div className="my-2">BILLETE 100.000</div>
                </td>
                <td className="px-4 py-2">
                  <input type="number" name="billete100000" 
                    value={denominaciones.billete100000}  
                    className="bg-gray-600 max-w-[100px] rounded-md text-center" 
                    onChange={handleChange}
                  />
                </td>
                <td className="px-4 py-2">
                  <div className="my-2">{(denominaciones.billete100000 * 100000).toLocaleString('de-DE')} Gs.</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <div className="flex items-center justify-center h-screen">
          <div className="absolute top-1/3 w-full">
            <Modal setShowModal={setShowModal}>
              <FormArqueo id={selectedId} />
            </Modal>
          </div>
        </div>
      )}
    </div>
  );
}
