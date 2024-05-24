import FormTransferencias from "@/components/dashboard/transferencias/form";
import Header from "@/components/global/Header";

export default async function Page() {
  return (
    <div>
      <Header title="Transferencias" className="-mt-8" />
      <div className="flex justify-center items-center mt-6 p-12 bg-gray-700 rounded-md">
        <FormTransferencias />
      </div>
    </div>
  );
}
