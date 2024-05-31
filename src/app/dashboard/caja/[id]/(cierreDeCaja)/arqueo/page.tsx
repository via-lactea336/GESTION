"use client";
import InputCalendar from "@/components/global/InputCalendar";
import React, { useState, useEffect } from "react";
import { Modal } from "@/components/global/Modal";
import FormArqueo from "@/components/cajaVentanasEmergentes/FormArqueo";
import { useParams } from "next/navigation";
import crearArqueo from "@/lib/arqueoCaja/crearArqueo";
import actualizarArqueoPorId from "@/lib/arqueoCaja/actualizarArqueo";
import calcularMontoEsperado from "@/lib/moduloCaja/arqueoCaja/calcularMontoEsperado";
import obtenerCajaPorId from "@/lib/cajas/obtenerCajaPorId";
import { ApiResponseData } from "@/lib/definitions";
import { Decimal } from "@prisma/client/runtime/library";


export default function Page() {
  const { id } = useParams();
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

  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [exitoArqueo, setExitoArqueo] = useState(false);

  const [datosCaja, setDatosCaja] = useState<
    {
      id: string;
      numero: number;
      estaCerrado: boolean;
      saldo: Decimal;
      deleted: Date | null;
      createdAt: Date;
      updatedAt: Date;
    }
  >();



  const [montoEsperado, setMontoEsperado] = useState<number>();
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowModal(true);
    setSelectedId(e.currentTarget.id);

    if(montoEsperado == totales.montoTotal){
      realizarCierre();
    }
  };

  const realizarCierre = async () =>{
    try {
      const montoEsperado = await crearArqueo({
        aperturaId: "",
        montoRegistrado: totales.montoTotal
      });
      if (montoEsperado === undefined || typeof montoEsperado === "string") {
        throw new Error("Error obteniendo las cuentas");
      }
      console.log(montoEsperado)
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const fetchCalculo = async () => {
      try {
        const montoEsperado = await calcularMontoEsperado(id as string);
        if (montoEsperado === undefined || typeof montoEsperado === "string") {
          throw new Error("Error obteniendo las cuentas");
        }
        console.log(montoEsperado)
        setMontoEsperado(montoEsperado);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchCaja = async () =>{
      try {
        const caja = await obtenerCajaPorId(id as string);
        if (caja === undefined || typeof caja === "string" || !caja) {
          throw new Error("Error obteniendo las cuentas");
        }
        console.log(caja.data)
        setDatosCaja(caja.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchCalculo();
    fetchCaja();
  }, [id]);


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
          <p className="font-bold mt-4 mb-2 ml-auto">
            N° Caja : {datosCaja?.numero}
          </p>
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
              <FormArqueo id={selectedId} exitoArqueo={exitoArqueo}/>
            </Modal>
          </div>
        </div>
      )}
    </div>
  );
}
