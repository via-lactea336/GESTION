import FormTransferencias from "@/components/dashboard/transferencias/form";
import Header from "@/components/global/Header";
import Link from "next/link";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  return (
    <div>
      <Header title="Transacciones" className="-mt-8">
        <Link
          href={`/dashboard/account/${id}`}
          className="bg-gray-800 py-1 px-2 rounded-md"
        >
          Ver Cheques
        </Link>
        <Link
          href={`/dashboard/account/${id}`}
          className="bg-gray-800 py-1 px-2 rounded-md"
        >
          Atrás
        </Link>
      </Header>
      <div className="flex justify-center items-center xs:w-3/4 w-full mx-auto mt-6 p-12 bg-gray-700 rounded-md">
        <FormTransferencias cuentaBancariaId={id} />
      </div>
    </div>
  );
}
