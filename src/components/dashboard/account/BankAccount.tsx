type BankAccountProps = {
  accountType: string;
  bankName: string;
  ruc: string; 
  company: string;
  amount: number;
  accountId: string; // Nuevo prop para el ID de la cuenta
};

const BankAccount: React.FC<BankAccountProps> = ({ accountType, bankName, ruc, company, amount, accountId }) => {
  return (
    <div className="bg-primary-400 p-5 rounded-md shadow-md relative m-12">
      <h2 className="text-lg font-bold">{accountType}</h2>
      <p className="text-sm text-black">{bankName}</p>
      <p className="text-sm text-black"> {ruc}</p> 
      <p className="text-sm text-black">Empresa {company}</p>
      <p className="text-xl absolute bottom-10 right-6">{amount} GS</p>
      <a href={`/dashboard/account/${accountId}`}>
        <button className="mt-4 bg-primary-600 text-white py-2 px-4 rounded-md">Ver Detalles</button>
      </a>
    </div>
  );
};

export default BankAccount;

