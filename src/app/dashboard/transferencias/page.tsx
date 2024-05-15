import FormTransferencias from "@/components/dashboard/transferencias/form";
import Header from "@/components/global/Header";
import obtenerBancos from "@/lib/banco/obtenerBancos";
import obtenerCuentaBancaria from "@/lib/cuentaBancaria/obtenerCuentaBancaria";
import obtenerTiposOperacion from "@/lib/tipoOperacion/obtenerTiposOperacion";

export default async function Page() {
  return (
    <div>
      <Header title="Transferencias" />
      <div className="flex justify-center items-center mt-6 p-12 bg-gray-700 rounded-md">
        <FormTransferencias />
      </div>
    </div>
  );
}
