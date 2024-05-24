import LoadingCirleIcon from "./LoadingCirleIcon";

export function Loading() {
    return (
      <div className='flex items-center justify-between w-full'>
        <span className=''>Cargando...</span>
        <LoadingCirleIcon className="lucide lucide-loader-circle animate-spin" />
      </div>
    );
  }