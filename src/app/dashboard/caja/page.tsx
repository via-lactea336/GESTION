import ContenedorCajas from "@/components/dashboard/caja/ContenedorCajas";
import Header from "@/components/global/Header";
import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth";

export default async function Page() {
  const session = await getServerSession(authOptions);

  return (
    <div className="relative">
      <Header title="Punto de venta" className="-mt-8">
        <span>{session ? session.user.nombre : "Desconocido"}</span>
        <span>{new Date().toISOString().split("T")[0]}</span>
      </Header>
      {session?.user.rol === "CAJERO" || session?.user.rol === "ADMIN" ? (
        <ContenedorCajas
          cajeroId={session.user.id}
          cajeroNombre={session.user.nombre}
        />
      ) : (
        <div className="flex justify-center items-center h-96">
          <p className="text-2xl">Debe ser un cajero para continuar</p>
        </div>
      )}
    </div>
  );
}
