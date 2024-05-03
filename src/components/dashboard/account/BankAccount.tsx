type BankAccountProps = {
  accountType: string;
  bankName: string;
  ruc: string;
  company: string;
  amount: number;
  accountId: string; // Nuevo prop para el ID de la cuenta
};

const BankAccount: React.FC<BankAccountProps> = ({
  accountType,
  bankName,
  ruc,
  company,
  amount,
  accountId,
}) => {
  return (
    <div className="bg-primary-400 py-6 px-4 rounded-md shadow-md relative m-12">
      <h2 className="text-lg font-bold">{accountType}</h2>
      <p className="text-sm text-black">{bankName}</p>
      <p className="text-sm text-black"> {ruc}</p>
      <p className="text-sm text-black">Empresa {company}</p>
      <div className="flex flex-row-reverse justify-between items-center pt-4 w-full">
        <p className="text-xl">{amount} GS</p>
        <a
          href={`/dashboard/account/${accountId}`}
          className="bg-primary-600 text-white py-2 px-2 text-sm rounded-md hover:bg-primary-700"
        >
          Ver Detalles
        </a>
      </div>
    </div>
  );
};

export default BankAccount;
