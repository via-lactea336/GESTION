import Link from "next/link";

type ModalProps = {
  children: React.ReactNode;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export function Modal({ children, setShowModal }: ModalProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowModal(false);
  };
  return (
    <div className="w-1/2 z-50 relative mx-auto align-middle h-full p-12 bg-gray-700 rounded-md">
      <button
        onClick={handleClick}
        className="absolute right-4 top-4"
        title="cerrar"
      >
        X
      </button>
      <div>{children}</div>
    </div>
  );
}
