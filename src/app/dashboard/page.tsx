import authOptions from "@/lib/auth/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

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
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <p className="text-lg">Bienvenido al dashboard!</p>
    </div>
  );
}
