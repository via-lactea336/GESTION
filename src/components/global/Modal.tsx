import { XMarkIcon } from "@heroicons/react/24/outline";

type ModalProps = {
  children: React.ReactNode;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
  padding?: string;
};

export function Modal({
  children,
  setShowModal,
  className,
  padding = "p-12",
}: ModalProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowModal(false);
  };
  return (
    <div
      className={
        "w-1/2 z-50 relative mx-auto align-middle h-full bg-gray-700 rounded-md " +
        className +
        " " +
        padding
      }
    >
      <button
        onClick={handleClick}
        className="absolute right-4 top-4"
        title="cerrar"
      >
        <XMarkIcon className="text-white  w-7 h-7 hover:text-primary-400" />
      </button>
      <div>{children}</div>
    </div>
  );
}
