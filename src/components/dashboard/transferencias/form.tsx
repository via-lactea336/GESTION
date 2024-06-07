"use client";
import Input from "@/components/global/Input";
import InputCalendar from "@/components/global/InputCalendar";
import obtenerBancos from "@/lib/moduloBanco/banco/obtenerBancos";
import obtenerCuentaBancaria from "@/lib/moduloBanco/cuentaBancaria/obtenerCuentaBancaria";
import { CuentaBancariaAndBanco } from "@/lib/definitions";
import { useCalendar } from "@/lib/hooks/useCalendar";
import agregarOperacion, { CrearOperacionFields } from "@/lib/moduloBanco/operacion/agregarOperacion";
import obtenerTiposOperacion from "@/lib/moduloBanco/tipoOperacion/obtenerTiposOperacion";
import { Banco, TipoOperacion } from "@prisma/client";
import { SetStateAction, useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import AgregarCheque from "./AgregarCheque";
import { ChequeCreate } from "./AgregarCheque";
import EmitirCheque from "./EmitirCheque";

type Operacion = {
  tipoOperacionId: string;
  fechaOperacion: Date;
  monto: number;
  cuentaBancariaOrigenId: string;
  bancoInvolucrado: string;
  nombreInvolucrado: string;
  cuentaInvolucrado: string;
  rucInvolucrado: string;
  concepto: string;
  numeroComprobante: string;
};

export default function FormTransferencias() {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setLoadingSend(true);
    event.preventDefault();
    // const form = event.currentTarget;
    // console.log(form["fechaOperacion"].value);
    // const dateValue = form["fechaOperacion"].value;
    // // Desglosar manualmente la fecha seleccionada
    // const [year, month, day] = dateValue.split("-").map(Number);
    // const fecha = new Date(year, month - 1, day); // Nota: los meses en JavaScript son 0-indexados

    // // Obtener la fecha y hora actuales
    // const fechaActual = new Date();

    // // Establecer los componentes de tiempo actuales en el objeto fecha
    // fecha.setHours(fechaActual.getHours());
    // fecha.setMinutes(fechaActual.getMinutes());
    // fecha.setSeconds(fechaActual.getSeconds());
    // fecha.setMilliseconds(fechaActual.getMilliseconds());

    // // Ahora fecha tiene la fecha seleccionada con la hora actual
    // console.log(fecha);
    // const aux = event.target as HTMLFormElement;
    // const operacion: Operacion = {
    //   tipoOperacionId: form["operacion"].value,
    //   fechaOperacion: fecha,
    //   monto: Number(form["monto"].value),
    //   cuentaBancariaOrigenId: form["cuentaBancariaOrigenId"].value,
    //   bancoInvolucrado: form["bancoInvolucrado"].value,
    //   nombreInvolucrado: form["nombreInvolucrado"].value,
    //   cuentaInvolucrado: form["cuentaInvolucrado"].value,
    //   rucInvolucrado: form["rucInvolucrado"].value,
    //   concepto: form["concepto"].value,
    //   numeroComprobante: form["comprobante"].value,
    // };

    console.log("Operacion:", operacion,"\n Cheques:", cheques)

    const response = await agregarOperacion({
      tipoOperacionId:operacion.tipoOperacionId,
      fechaOperacion: new Date(operacion.fechaOperacion),
      monto: operacion.monto,
      cuentaBancariaOrigenId:operacion.cuentaBancariaOrigenId,
      bancoInvolucrado: operacion.bancoInvolucrado,
      nombreInvolucrado: operacion.nombreInvolucrado,
      cuentaInvolucrado: operacion.cuentaInvolucrado,
      rucInvolucrado: operacion.rucInvolucrado,
      concepto: operacion.concepto,
      numeroComprobante: operacion.numeroComprobante,
      cheques:cheques
    }
    );
    if (response !== undefined && typeof response !== "string") {
      if (response.error) {
        toast.error(response.error);
        setLoadingSend(false);
      } else {
        setLoadingSend(false);
        toast.success("Operación registrada correctamente");
        setOperacion(initialValues);
        setCheques([]);
      }
    }
  };

  //Estado de la operacion a ser creada
  const initialValues = {
    tipoOperacionId: "",
    fechaOperacion: new Date(),
    monto: 0,
    cuentaBancariaOrigenId: "",
    nombreInvolucrado: "",
    concepto: "",
    numeroComprobante: "",
    cuentaInvolucrado: undefined,
    rucInvolucrado: undefined,
    bancoInvolucrado: undefined,
  }
  const [operacion, setOperacion] = useState<CrearOperacionFields>(initialValues);
  
  //Naturaleza de la operacion
  const [nombreOperacion, setNombreOperacion] = useState("");
  const [esDebito, setEsDebito] = useState<boolean>(false);
  
  //Estados para manejar opciones 
  const [bancos, setBancos] = useState<Banco[]>([]);
  const [cuentasBancarias, setCuentasBancarias] = useState<CuentaBancariaAndBanco[]>([]);
  const [operaciones, setOperaciones] = useState<TipoOperacion[]>([]);

  //Estados para el manejo de estados de carga/error
  const [loading, setLoading] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);

  //Manejo de cheques
  const [cheques, setCheques] = useState<ChequeCreate[]>([]);

  //Handle onChange of the inputs
  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement| HTMLSelectElement>) => {
    const { name, value, id, type } = event.target;
    if(type === "datetime-local") setOperacion({...operacion, [name||id]: new Date(value).toISOString()});
    setOperacion({ ...operacion, [name||id]: value });
  };

  //Fetch data for the form
  const fetchDatos = async () => {
    setLoading(true);
    const bancos = await obtenerBancos();
    const cuentasBancarias = await obtenerCuentaBancaria();
    const operaciones = await obtenerTiposOperacion();
    if (
      bancos !== undefined &&
      cuentasBancarias !== undefined &&
      operaciones !== undefined &&
      typeof bancos !== "string" &&
      typeof cuentasBancarias !== "string" &&
      typeof operaciones !== "string"
    ) {
      setBancos(bancos.data);
      setCuentasBancarias(cuentasBancarias.data);
      setOperaciones(operaciones.data);
      setEsDebito(operaciones.data[0].esDebito);
      setNombreOperacion(operaciones.data[0].nombre);
      setOperacion({
        ...operacion,
        tipoOperacionId: operaciones.data[0].id,
        cuentaBancariaOrigenId: cuentasBancarias.data[0].id,
        bancoInvolucrado: bancos.data[0].id,
      })
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDatos();
  }, []);

  useEffect(() => {
    setOperacion({
      ...operacion,
      cuentaBancariaOrigenId: cuentasBancarias.length > 0 ? cuentasBancarias[0].id : "",
      nombreInvolucrado: initialValues.nombreInvolucrado,
      bancoInvolucrado: initialValues.bancoInvolucrado,
      rucInvolucrado: initialValues.rucInvolucrado,
      cuentaInvolucrado: initialValues.cuentaInvolucrado,
    })
    setCheques([])
  }, [operacion.tipoOperacionId])

  console.log(operacion)

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <div className="w-full mb-6">
          <label className="mb-2">Tipo de Transacción</label>
          <div className="relative mt-2">
            <select
              className="block appearance-none w-full bg-gray-800 py-3 px-4 pr-8 rounded leading-tight focus:outline-none"
              id="tipoOperacionId"
              required
              onChange={(e) => {
                handleOnChange(e);
                setEsDebito(
                  operaciones.find((op) => op.id === e.target.value)
                    ?.esDebito || false
                );
                setNombreOperacion(
                  operaciones.find((op) => op.id === e.target.value)?.nombre || ""
                )
              }}
            >
              {loading ? (
                <option>Cargando...</option>
              ) : (
                operaciones.map((operacion) => (
                  <option key={operacion.id} value={operacion.id}>
                    {operacion.nombre}
                  </option>
                ))
              )}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
    { 
      nombreOperacion === "Depósito"? 
      
        <AgregarCheque 
          monto={operacion.monto} 
          setOperacion={setOperacion} 
          cheques={cheques} 
          setCheques={setCheques} 
          bancos={bancos} 
          cuentasBancarias={cuentasBancarias}
          handleOnChangeOperacion={handleOnChange}
        /> 
      
      :

      nombreOperacion === "Emitir Cheque"?

        <EmitirCheque 
          setOperacion={setOperacion}
          cheques={cheques}
          setCheques={setCheques}
          cuentasBancarias={cuentasBancarias}
          handleOnChangeOperacion={handleOnChange}
        />
      :
      <>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
          <label className="mb-2">
            Cuenta del {
              !esDebito ? "Beneficiario" : "Remitente"
            }
          </label>
          <div className="relative mt-2">
            <select
              className="block appearance-none w-full bg-gray-800 py-3 px-4 pr-8 rounded leading-tight focus:outline-none"
              onChange={handleOnChange}
              id="cuentaBancariaOrigenId"
              required
            >
              {loading ? (
                <option>Cargando...</option>
              ) : (
                cuentasBancarias.map((cuenta) => (
                  <option key={cuenta.id} value={cuenta.id}>
                    {cuenta.banco.nombre.split("Banco")} {cuenta.numeroCuenta}
                  </option>
                ))
              )}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
          <label className="mb-2">
            Banco del {esDebito ? "Beneficiario" : "Remitente"}
          </label>
          <div className="relative mt-2">
            <select
              onChange={handleOnChange}
              className="block appearance-none w-full bg-gray-800 py-3 px-4 pr-8 rounded leading-tight focus:outline-none"
              id="bancoInvolucrado"
              required
            >
              {loading ? (
                <option>Cargando...</option>
              ) : (
                bancos.map((banco) => (
                  <option key={banco.id} value={banco.nombre}>{banco.nombre}</option>
                ))
              )}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
          <label className="mb-2">
            Cuenta del {esDebito ? "Beneficiario" : "Remitente"}
          </label>
          <Input
            className="block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none"
            id="cuentaInvolucrado"
            onChange={handleOnChange}
            required
            type="text"
            placeholder="22-187805"
          />
        </div>
      </div>

      <div className="flex flex-wrap -mx-3 mb-2">
        <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
          <label className=" mb-2">
            Nombre del {esDebito ? "Beneficiario" : "Remitente"}
          </label>
          <Input
            className="block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none"
            id="nombreInvolucrado"
            onChange={handleOnChange}
            type="text"
            required
            placeholder="Pedro Meza"
          />
        </div>
        <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
          <label className="mb-2">Ruc</label>
          <Input
            className="block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none"
            id="rucInvolucrado"
            onChange={handleOnChange}
            type="text"
            required
            placeholder="123456-1"
          />
        </div>
        <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
          <label className=" mb-2">Monto</label>
          <Input
            className={'block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none'}
            id="monto"
            onChange={handleOnChange}
            type="number"
            required
            placeholder="150000"
          />
        </div>
        <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
          <label className="mb-2">Número de Comprobante</label>
          <Input
            className="block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none"
            id="numeroComprobante"
            type="text"
            onChange={handleOnChange}
            required
            placeholder="012345"
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-2">
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label className="mb-2">Fecha de la Transacción</label>
          <InputCalendar
            withTime={true}
            className="block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none"
            id="fechaOperacion"
            handleChange={handleOnChange}
            required
          />
        </div>
        <div className="w-full md:w-2/3 px-3 mb-6 md:mb-0">
          <label className="mb-2">Concepto</label>
          <Input
            className="block w-full bg-gray-800 rounded py-3 px-6 my-2 leading-tight focus:outline-none"
            id="concepto"
            type="text"
            onChange={handleOnChange}
            required
            placeholder="Pago de servicios básicos"
          />
        </div>
      </div>
      </>
    }
      <div className="px-3 flex items-center justify-end mb-6 md:mb-0">
        <button
          type="submit"
          className={
            "bg-primary-800 mt-4 rounded-md px-3 py-3  hover:bg-primary-700 " +
            (loading || loadingSend ? " cursor-progress" : "cursor-pointer")
          }
        >
          {loadingSend ? "Registrando..." : "Registrar Transacción"}
        </button>
      </div>
      <Toaster richColors />
    </form>
  );
}