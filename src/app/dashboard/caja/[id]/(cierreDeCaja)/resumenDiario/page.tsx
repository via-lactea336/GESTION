import Header from "@/components/global/Header";
import ResumenDeCaja from "@/components/dashboard/resumendiario/ResumenDeCaja";
import TablaResumen from "@/components/dashboard/resumendiario/TablaResumen";

export default function Page() {
    return (
      <div className="flex flex-col h-full -mt-8">
        <Header title="Resumen diario" />
        
        <div className="bg-gray-800 py-6 px-4 rounded-md shadow-md "> 
          <div className="flex justify-center gap-8" > {/* Ajusta el espaciado horizontal */}
          <div className="w-full">
            <ResumenDeCaja
              estado="Cerrado"
              cajaInicial={100000}
              dineroEnCaja={700000}
              diferencia={600000}
              fecha="27/05/2024" 
              caja="1"
              
            />
            </div>
            
          </div>
          <TablaResumen
          efectivo= {100000}
          cheque={200000}
          deposito={100000}/>
    
        </div>
      </div>
    );
  }