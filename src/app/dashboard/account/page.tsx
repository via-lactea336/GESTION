import Header from "@/components/dashboard/account/Header";
import BankAccount from "@/components/dashboard/account/BankAccount";

export default function Page() {
  return (
    <div className="flex flex-col h-full -mt-8">
      <Header />

      <div className="bg-primary-200 container mx-auto mt-2">
        <h1 className="text-4xl font-bold text-center pt-3 text-primary-900">
          Cuentas
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          <BankAccount
            accountType="Cuenta Corriente"
            bankName="Banco Familiar"
            ruc="1234567-8"
            company="X"
            amount={5000}
            accountId="10"
          />
          <BankAccount
            accountType="Cuenta de Ahorro"
            bankName="Banco Continental"
            ruc="7894561-2"
            company="X"
            amount={10000}
            accountId="2"
          />
        </div>
      </div>
    </div>
  );
}
