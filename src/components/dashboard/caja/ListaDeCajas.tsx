import LoadingCirleIcon from "@/components/global/LoadingCirleIcon";
import { Caja } from "@prisma/client";

type Props = {
  data: Caja[];
  mensaje: string;
  loading: boolean;
  handleClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function ListaDeCajas({
  data,
  mensaje,
  loading,
  handleClick,
}: Props) {
  return (
    <div className="text-gray-200 flex flex-col gap-8 items-center mt-5">
      {data.length === 0 && <p>{mensaje}</p>}
      {loading && <LoadingCirleIcon className="animate-spin" />}
      {data.map((caja, i) => (
        <div key={i} className="flex w-full gap-8">
          <p className="flex-1 px-4 pt-3 text-center rounded-md bg-gray-700">
            Caja {caja.numero}
          </p>
          <p className="flex-1 px-4 pt-3 text-center rounded-md bg-gray-700">
            Cerrada
          </p>
          <button
            onClick={handleClick}
            id={caja.id}
            className="flex-1 px-4 py-3 rounded-md bg-gray-700 hover:bg-gray-800"
          >
            Abrir caja
          </button>
        </div>
      ))}
    </div>
  );
}
