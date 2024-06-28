import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import {
  BanknotesIcon,
  ChartBarIcon,
  CircleStackIcon,
  DocumentChartBarIcon,
} from "@heroicons/react/24/outline";

import Link from "next/link";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/login");
  if (session.user.rol !== "ADMIN") {
    return (
      <div className="grid place-items-center h-[70vh]">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-primary-400">403</h1>
          <p className="text-xl  text-gray-100 py-4">Acceso no autorizado</p>
          <p className="text-lg  text-gray-200">
            Usted debe ser un administrador para acceder a esta página.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex w-full flex-col bg-muted/40">
      <main className="grid flex-1 w-full items-center justify-center gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <h1 className="text-center text-3xl">Bienvenido al Panel General</h1>
        <div className="flex w-full items-center gap-8">
          <div className="text-center bg-gray-800 rounded-md py-3 px-6 border border-gray-100 w-72 h-72 flex flex-col justify-between">
            <div className="flex flex-col justify-center flex-1">
              <DocumentChartBarIcon className="h-12 w-12 mx-auto text-primary mb-2" />
              <h3 className="text-xl font-semibold">Banco</h3>
              <p className="text-muted-foreground">
                Accede a tu información bancaria
              </p>
            </div>
            <div className="mb-4">
              <Link
                href="/dashboard/account/panel"
                className="px-4 py-2 bg-primary-800 text-white rounded-md w-3/4 hover:bg-primary-700"
              >
                Ir al panel
              </Link>
            </div>
          </div>
          <div className="text-center bg-gray-800 rounded-md py-3 px-6 border border-gray-100 w-72 h-72 flex flex-col justify-between ">
            <div className="flex flex-col justify-center flex-1">
              <CircleStackIcon className="h-12 w-12 mx-auto text-primary mb-2" />
              <h3 className="text-xl font-semibold ">Caja</h3>
              <p className="text-muted-foreground">
                Gestiona tus movimientos de caja
              </p>
            </div>
            <div className="mb-4">
              <Link
                href="/dashboard/caja/panelDeAdministracion"
                className="px-4 py-2 bg-primary-800 text-white rounded-md w-3/4 hover:bg-primary-700"
                prefetch={false}
              >
                Ir al panel
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
