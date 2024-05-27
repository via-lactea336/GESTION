import { Form } from "@/components/auth/Form";
import FormApertura from "@/components/cajaVentanasEmergentes/FormApertura";
import Input from "@/components/global/Input";

export default function Page() {
  return (
    <>
      <header className="flex gap-3 justify-between items-center flex-wrap px-8 py-4 -mt-8 w-full rounded-md bg-primary-800 text-white">
        <h1 className="text-2xl font-bold">Apertura de Caja</h1>
        <nav className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3">
            <h3 className="mr-2">Vendedor/a: Belencita Uwu</h3>
          </div>
          <div className="flex items-center gap-3">
            <h3>Caja N° 1</h3>
          </div>
        </nav>
      </header>
      <div className="w-full flex flex-col items-center justify-center pt-8">
        <div className="flex justify-center items-center  p-12 bg-gray-700 rounded-md">
          <FormApertura />
        </div>
      </div>
    </>
  );
}
