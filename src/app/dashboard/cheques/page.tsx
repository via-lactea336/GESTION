import Header from "@/components/global/Header";
import CrearCheques from "@/components/dashboard/cheques/CrearCheques";

export default function Page() {
  return (
    <div className="flex flex-col h-full -mt-8">
      <Header title="Registrar cheques" />
      <div className="flex-grow p-6">
        <CrearCheques />
      </div>
      {/* Aquí puedes agregar el contenido de tu página */}
    </div>
  );
}
