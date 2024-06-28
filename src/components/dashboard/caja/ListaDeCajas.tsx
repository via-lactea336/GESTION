import LoadingCirleIcon from "@/components/global/LoadingCirleIcon";
import { Caja } from "@prisma/client";

type Props = {
  data: Caja[];
  mensaje: string;
  loading: boolean;
  handleClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  cajaId: string;
};

export default function ListaDeCajas({
  data,
  mensaje,
  loading,
  handleClick,
  className,
  cajaId,
}: Props) {
  return (
    <div
      className={
        "text-gray-200 flex flex-col gap-8 items-center mt-5 " + className
      }
    >
      {data.length === 0 && <p>{mensaje}</p>}
      {loading && <LoadingCirleIcon className="animate-spin" />}
      {data.map((caja, i) => (
        <div key={i} className="flex w-full gap-8">
          <p
            className="flex-1 px-4 pt-3 text-center rounded-md bg-gray-700"
            id={`${caja.numero}`}
          >
            Caja {caja.numero}
          </p>
          <p className="flex-1 px-4 pt-3 text-center rounded-md bg-gray-700">
            {cajaId === caja.id
              ? "Abierto"
              : caja.estaCerrado
              ? "Cerrado"
              : "Abierto"}
          </p>
          <button
            onClick={handleClick}
            id={caja.id}
            className={
              "flex-1 px-4 py-3 rounded-md bg-gray-700 hover:bg-gray-800 " +
              (cajaId === caja.id
                ? "cursor-pointer"
                : caja.estaCerrado && !cajaId
                ? "cursor-pointer"
                : "bg-gray-800 cursor-not-allowed")
            }
          >
            {cajaId === caja.id
              ? "Continuar Trabajando"
              : caja.estaCerrado && !cajaId
              ? "Abrir Caja"
              : caja.estaCerrado && cajaId
              ? "No puedes abrir esta caja"
              : "Cajero Trabajando"}
          </button>
        </div>
      ))}
    </div>
  );
}
