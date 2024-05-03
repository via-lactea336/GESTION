
import Header from "@/components/dashboard/account/Header";
import BankAccount from "@/components/dashboard/account/BankAccount";

export default function Page() {
  return (
    <div>
      <Header />
      
      <div className="bg-primary-200 container mx-auto mt-2">
        <h1 className="text-4xl font-bold text-center mb-5">Cuentas</h1>
        <div className="grid grid-cols-3 gap-4">
          <BankAccount accountType="Cuenta Corriente" bankName="Banco Familiar" ruc="1234567-8" company="X"  amount={5000} />
          <BankAccount accountType="Cuenta de Ahorro" bankName="Banco Continental" ruc="7894561-2" company="X" amount={10000} />
        </div>
      </div>
      
    </div>
  );
}