import obtenerCuentaBancariaPorId from "@/lib/cuentaBancaria/obtenerCuentaBancariaPorId";
import obtenerOperaciones from "@/lib/operacion/obtenerOperaciones";
import Image from "next/image";

type Props = {
    params : {id: string}
}

const  AccountDetailsTab = async ( {params}: Props) => {
    const accountData = {
        accountType: "",
        accountNumber: "",
        availableBalance: 0,
        retainedBalance: 0,
    };

    const cuenta = await obtenerCuentaBancariaPorId(params.id);
    const operaciones = await obtenerOperaciones();

    if(cuenta === undefined) return <div>Error obteniendo la cuenta</div>;
    if (typeof(cuenta) === "string") return <div>{cuenta}</div>;

    accountData.accountType = cuenta.data?.esCuentaAhorro? "Cuenta de ahorro" : "Cuenta Corriente"; 
    if(typeof(cuenta.data?.saldo) === "number") accountData.retainedBalance = cuenta.data?.saldo;
    if(typeof(cuenta.data?.saldoDisponible) === "number") accountData.availableBalance = cuenta.data?.saldoDisponible;
    if(typeof(cuenta.data?.numeroCuenta) === "string") accountData.accountNumber = cuenta.data?.numeroCuenta;
    return (
        <div className="flex flex-col h-full -mt-8">
        {/* Encabezado con título y botón de retroceso */}
        <div className="flex justify-between items-center bg-primary-600 p-4 border-2 border-black">
            <h1 className="text-4xl font-bold mt-10 mb-10">Detalle cuentas</h1>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 -mt-20 rounded">
            Atrás
            </button>
        </div>

        {/* Contenido principal */}
        <div className="flex-grow bg-primary-200 shadow-md border-2 border-black pt-10 pb-10 pl-10 flex flex-row">
            {/* Datos de la cuenta */}
            <Image
            src="https://img.freepik.com/vector-gratis/hucha_53876-25494.jpg?size=338&ext=jpg&ga=GA1.1.1687694167.1714694400&semt=ais"
            alt="Account"
            width={20}
            height={20}
            className="w-20 h-20 object-cover mr-12 mt-10"
            />
            <div className="flex-1 mr-8 mt-12">
            <div className="mb-4 flex items-center">
                <label className="block text-gray-700 font-bold mr-2">
                Tipo de Cuenta:
                </label>
                <p className="text-gray-700">{accountData.accountType}</p>
            </div>
            <div className="mb-4 flex items-center">
                <label className="block text-gray-700 font-bold mr-2">
                Nombre de la Cuenta:
                </label>
                <p className="text-gray-700">{accountData.accountNumber}</p>
            </div>
            </div>

            <div className="flex-1 mt-12">
            <div className="mb-4 flex items-center">
                <label className="block text-gray-700 font-bold mr-2">
                Saldo Disponible:
                </label>
                <p className="text-gray-700">
                ${accountData.availableBalance.toFixed(2)}
                </p>
            </div>
            <div className="flex items-center">
                <label className="block text-gray-700 font-bold mr-2">
                Saldo Retenido:
                </label>
                <p className="text-gray-700">
                ${accountData.retainedBalance.toFixed(2)}
                </p>
            </div>
            </div>
        </div>
        <h1 className="text-3xl font-bold mt-10">Movimientos</h1>
        <div className="flex-grow bg-primary-200 shadow-md border-2 border-black p-10 flex flex-row">
            <table className="border-collapse w-full">
            <tbody>
                <tr>
                <td>
                    <h1 className="text-xl font-bold mt-1 text-black">Operacion</h1>
                </td>
                <td>
                    <h1 className="text-xl font-bold mt-1 text-black">Fecha</h1>
                </td>
                <td>
                    <h1 className="text-xl font-bold mt-1 text-black">
                    Descripcion
                    </h1>
                </td>
                <td>
                    <h1 className="text-xl font-bold mt-1 text-black">
                    Monto Transaccion
                    </h1>
                </td>
                <td>
                    <h1 className="text-xl font-bold mt-1 text-black">
                    Saldo Actual
                    </h1>
                </td>
                </tr>
                <tr>
                <td>
                    <Image
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6lo6gclz5yoqrqK6NRz4qp5T2NDyBgcDfFx-IxBUTew&s"
                    alt="Account"
                    width={10}
                    height={10}
                    className="w-10 h-10 object-cover rounded-full bg-violet-400 mt-5 mb-5 ml-5"
                    />
                </td>
                <td>
                    <h1 className="text-base font-normal mt-1 text-black">
                    10-02-2024
                    </h1>
                </td>
                <td>
                    <h1 className="text-base font-normal mt-1 text-black">
                    Inserse Descripcion aqui
                    </h1>
                </td>
                <td>
                    <h1 className="text-xl font-bold mt-1 text-green-500">
                    +200.00$
                    </h1>
                </td>
                <td>
                    <h1 className="text-base font-normal mt-1 text-black">
                    3000.00$
                    </h1>
                </td>
                </tr>
                <tr>
                <td>
                    <Image
                    src="https://c1.klipartz.com/pngpicture/658/794/sticker-png-banking-arrow-money-bank-account-wire-transfer-electronic-funds-transfer-demand-deposit-mobile-banking-stanbic-ibtc-bank.png"
                    alt="Account"
                    width={10}
                    height={10}
                    className="w-10 h-10 object-cover rounded-full bg-violet-400 mt-5 mb-5 ml-5"
                    />
                </td>
                <td>
                    <h1 className="text-base font-normal mt-1 text-black">
                    10-02-2024
                    </h1>
                </td>
                <td>
                    <h1 className="text-base font-normal mt-1 text-black">
                    Inserse Descripcion aqui
                    </h1>
                </td>
                <td>
                    <h1 className="text-xl font-bold mt-1 text-red-500">
                    -200.00$
                    </h1>
                </td>
                <td>
                    <h1 className="text-base font-normal mt-1 text-black">
                    2800.00$
                    </h1>
                </td>
                </tr>
            </tbody>
            </table>
        </div>
        </div>
    );
};
export default AccountDetailsTab;
