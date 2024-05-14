import Header from "@/components/dashboard/cheques/Header";
import CrearCheques from "@/components/dashboard/cheques/CrearCheques";
import { Banco } from "@prisma/client";


export default function Page() {
    return (
        <div className="flex flex-col h-full -mt-8">
            <Header />
            <div className="flex-grow p-6">
            <CrearCheques />
            </div>
            {/* Aquí puedes agregar el contenido de tu página */}
        </div>
    );
}
