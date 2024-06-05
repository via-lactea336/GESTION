import Header from "@/components/global/Header";
import ResumenDeCaja from "@/components/dashboard/resumendiario/ResumenDeCaja";
import { Decimal } from '@prisma/client/runtime/library';
import { RegistroCaja } from '@prisma/client';

import { fetchPlus } from "@/lib/verificarApiResponse";



export default function Page() {

  const registroCaja: RegistroCaja = {
    id: "1",
    aperturaId: "Cerrado",
    montoInicial: new Decimal(1000),
    montoRegistrado: new Decimal(700000),
    montoEsperado: new Decimal(600000),
    cantCheques: 5,
    cantTarjetas: 3,
    montoIngreso: new Decimal(900000),
    montoEgreso: new Decimal(200000),
    montoIngresoCheque: new Decimal(400000),
    montoEgresoCheque: new Decimal(100000),
    montoIngresoTarjeta: new Decimal(300000),
    montoEgresoTarjeta: new Decimal(50000),
    createdAt: new Date(),
    updatedAt: new Date(),
    deleted: null
  };

  return (
    <div className="flex flex-col h-full -mt-8">
      <Header title="Resumen diario" />
      <div className="bg-gray-800 py-6 px-4 rounded-md shadow-md"> 
        <div className="flex justify-center gap-8">
          <div className="w-full">
            <ResumenDeCaja {...registroCaja} />
          </div>
        </div>
      </div>
    </div>
  );
}
