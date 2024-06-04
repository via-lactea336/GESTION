"use client";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { Toaster, toast } from "sonner";

type ModalProps = {
  children: React.ReactNode;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  isBryan?: boolean;
};

export function Modal({ children, setShowModal, isBryan = true }: ModalProps) {
  const router = useRouter();
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowModal(false);
  };
  const handleRedirect = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    toast.message("Caja cerrada correctamente");
    router.push("/dashboard/caja");
  };
  return (
    <div className="w-1/2 z-50 relative mx-auto align-middle h-full p-12 bg-gray-700 rounded-md">
      <button
        onClick={isBryan ? handleClick : handleRedirect}
        className="absolute right-4 top-4"
        title="cerrar"
      >
        <XMarkIcon className="text-white  w-7 h-7 hover:text-primary-400" />
      </button>
      <div>{children}</div>
      <Toaster richColors />
    </div>
  );
}
