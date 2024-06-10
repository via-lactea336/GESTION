import ContenedorCajas from "@/components/dashboard/caja/ContenedorCajas";
import Header from "@/components/global/Header";
import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function Page() {
  const session = await getServerSession(authOptions);
  const links = [
    { href: `/dashboard/caja`, text: "Inicio" },
    { href: `/dashboard/caja/reportes`, text: "Reportes" },
  ];

  return (
    <div className="relative">
      <Header title="Apertura De Caja" className="-mt-8">
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className="bg-gray-800 py-1 px-2 rounded-md hover:text-primary-100 hover:bg-gray-900 mx-2"
          >
            {link.text}
          </Link>
        ))}
        <span>{session ? session.user.nombre : "Desconocido"}</span>
        <span>
          {new Date()
            .toISOString()
            .split("T")[0]
            .split("-")
            .reverse()
            .join("-")}
        </span>
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
