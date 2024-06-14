"use client";
import { Comprobante, Factura, Movimiento, MovimientoDetalle } from "@prisma/client";

export type movimientoDetallado = Movimiento & {
    factura:Factura|null
    comprobantes: Comprobante & {user: {nombre: string, apellido: string, docIdentidad: string}}[];
    movimientoDetalles: MovimientoDetalle[];
}

export default function DetalleMovimiento(movimiento : movimientoDetallado | null) {
    const formatDate = (dateString: Date|undefined) => {
        if(!dateString) return
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const formattedDate = `${day < 10 ? "0" + day : day}-${
        month < 10 ? "0" + month : month
        }-${year}`;
        return formattedDate;
    };
    const formatTime = (dateString: Date|null) => {
        if(!dateString) return
        const date = new Date(dateString);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const formattedTime = `${hours < 10 ? "0" + hours : hours}:${
        minutes < 10 ? "0" + minutes : minutes
        }`;
        return formattedTime;
    };
    return (
        !movimiento?
        <div>Loading....</div>
        :
        (movimiento.esIngreso)? 
        <div className="bg-gray-800 py-6 px-4 rounded-md shadow-md mt-5 flex flex-col">
            <div className="mb-5">
                <h1 className="text-center text-xl">Operacion de Ingreso</h1>
            </div>
            <div className="flex flex-row justify-between">
                <div className="mr-20">
                    <h1 className="mb-2">Monto total de la operacion : {Number(movimiento.monto).toLocaleString()} Gs.</h1>
                    <h1 className="mb-2">Fecha: {formatDate(movimiento.createdAt)}</h1>
                    <h1 className="mb-2">Hora: {formatTime(movimiento.createdAt)}</h1>
                </div>
                <div className="ml-20">
                    <h1 className="mb-2">Detalles de Factura</h1>
                    <h1 className="mb-2">Tipo de factura : {movimiento.factura?.esContado? "Contado": "Credito"}</h1>
                    <h1 className="mb-2">Numero de Factura : {movimiento.factura?.numeroFactura}</h1>
                    <h1 className="mb-2">Fecha de emision de la factura : {"  "}
                        {movimiento.factura?.createdAt?
                        formatDate(movimiento.factura?.createdAt) : ""}</h1>
                    <h1 className="mb-2">Monto total a pagar : {Number(movimiento.factura?.total).toLocaleString()} Gs.</h1>
                </div>
            </div>
            <div className="bg-gray-800 py-6 px-4 rounded-md shadow-md mt-5 flex flex-col">
                <h1 className="mb-2">Detalles Operacion</h1>
                {movimiento.movimientoDetalles.map((detalle, index) =>(
                <div key={index} className="flex flex-row justify-between border-b border-white mt-5">
                    <h1 className="mb-2">N°{index + 1}</h1>
                    <h1 className="mb-2">Metodo de pago: {detalle.metodoPago}</h1>
                    <h1 className="mb-2">Monto Parcial: {Number(detalle.monto).toLocaleString()} Gs.</h1>
                </div>
                ))}
            </div>
        </div>:
        <div className="bg-gray-800 py-6 px-4 rounded-md shadow-md mt-5 flex flex-col">
            <div className="mb-5">
                <h1 className="text-center text-xl">Operacion de Egreso</h1>
            </div>
            <div className="flex flex-row justify-between">
                <div className="mr-20">
                    <h1 className="mb-2">Monto total de la operacion : {Number(movimiento.monto).toLocaleString()} Gs.</h1>
                    <h1 className="mb-2">Extraccion en efectivo</h1>
                    <h1 className="mb-2">Fecha: {formatDate(movimiento.createdAt)}</h1>
                    <h1 className="mb-2">Hora: {formatTime(movimiento.createdAt)}</h1>
                </div>
                <div className="ml-20">
                    <h1 className="mb-2">Encargado: {"  "}
                        {movimiento.comprobantes[0].user.nombre}{"  "}
                        {movimiento.comprobantes[0].user.apellido}  
                    </h1>
                    <h1 className="mb-2">RUC: {movimiento.comprobantes[0].user.docIdentidad}</h1>
                    <h1 className="mb-2">Observaciones: {movimiento.comprobantes.concepto}</h1>
                </div>
            </div>
        </div>
    );
}
