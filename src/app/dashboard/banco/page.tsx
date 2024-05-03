import React from 'react';

const AccountDetailsTab = () => {
    const userData = {
        accountType: "Cuenta Corriente",
        accountName: "Coyote",
        availableBalance: 3000,
        retainedBalance: 2000
    };

    return (
        <div className="flex flex-col h-full -mt-8">
            {/* Encabezado con título y botón de retroceso */}
            <div className="flex justify-between items-center bg-violet-600 p-4 border-2 border-black">
                <h1 className="text-4xl font-bold mt-10 mb-10">Detalle cuentas</h1>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 -mt-20 rounded"
                >
                    Atrás
                </button>
            </div>

            {/* Contenido principal */}
            <div className="flex-grow bg-violet-400 shadow-md border-2 border-black pt-10 pb-10 pl-10 flex flex-row">
                {/* Datos de la cuenta */}
                <img
                    src="https://via.placeholder.com/150"
                    alt="Account"
                    className="w-30 h-15 object-cover mr-12"
                />
                <div className="flex-1 mr-8 mt-12">
                    <div className="mb-4 flex items-center">
                        <label className="block text-gray-700 font-bold mr-2">Tipo de Cuenta:</label>
                        <p className="text-gray-700">{userData.accountType}</p>
                    </div>
                    <div className="mb-4 flex items-center">
                        <label className="block text-gray-700 font-bold mr-2">Nombre de la Cuenta:</label>
                        <p className="text-gray-700">{userData.accountName}</p>
                    </div>
                </div>
                
                <div className="flex-1 mt-12">
                    <div className="mb-4 flex items-center">
                        <label className="block text-gray-700 font-bold mr-2">Saldo Disponible:</label>
                        <p className="text-gray-700">${userData.availableBalance.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center">
                        <label className="block text-gray-700 font-bold mr-2">Saldo Retenido:</label>
                        <p className="text-gray-700">${userData.retainedBalance.toFixed(2)}</p>
                    </div>
                </div>
            </div>
            <h1 className="text-3xl font-bold mt-10">Movimientos</h1>
            <div className="flex-grow bg-violet-400 shadow-md border-2 border-black pt-10 pb-10 pl-10 flex flex-row">
                
            </div>
        </div>
    );
};

export default AccountDetailsTab;
