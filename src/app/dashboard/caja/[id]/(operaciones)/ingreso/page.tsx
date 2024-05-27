"use client";
import CheckoutWizard from "@/components/cajaVentanasEmergentes/Paginacion";

export default function Page() {
  return (
    <>
      <header className="flex gap-3 justify-between items-center flex-wrap -mt-8 px-8 py-4 w-full rounded-md bg-primary-800 text-white">
        <h1 className="text-2xl font-bold">Punto de Ventas</h1>
        <nav className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3">
            <h3 className="mr-2">Vendedor/a: Belencita Uwu</h3>
          </div>
          <div className="flex items-center gap-3">
            <h3>Caja N° 1</h3>
          </div>
        </nav>
      </header>
      <CheckoutWizard />
    </>
  );
}
