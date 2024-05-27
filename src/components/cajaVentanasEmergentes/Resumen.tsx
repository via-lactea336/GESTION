type Step3Props = {
  prevStep: () => void;
};

const Step3: React.FC<Step3Props> = ({ prevStep }) => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Resumen</h1>
      <div className="flex flex-row">
        <div className="mb-4 flex-1">
          <p><strong>Fecha de operación:</strong> 26/05/2024</p>
          <p><strong>Hora de operación:</strong> 14:26</p>
          <p><strong>Cajero/a:</strong> Fulana Mengana</p>
        </div>
        <div className="mb-4 flex-1">
          <p><strong>Entidad:</strong> Cliente</p>
          <p><strong>Cliente:</strong> 05 - Ana Britez</p>
          <p><strong>RUC:</strong> 2.369.254</p>
        </div>
        <div className="mb-4 flex-1">
          <table className="min-w-full border-collapse border border-gray-400 mb-8">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Método</th>
                <th className="border border-gray-300 px-4 py-2">Monto</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Efectivo</td>
                <td className="border border-gray-300 px-4 py-2">15.000</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Tarjeta de Crédito</td>
                <td className="border border-gray-300 px-4 py-2">40.000</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Cheque</td>
                <td className="border border-gray-300 px-4 py-2">5.000</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-bold">Total:</td>
                <td className="border border-gray-300 px-4 py-2">60.000</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <table className="min-w-full border-collapse border border-gray-400 mb-8">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Descripción</th>
            <th className="border border-gray-300 px-4 py-2">Cantidad</th>
            <th className="border border-gray-300 px-4 py-2">Precio Unitario</th>
            <th className="border border-gray-300 px-4 py-2">Importe</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 px-4 py-2">16</td>
            <td className="border border-gray-300 px-4 py-2">Shampoo Loreal</td>
            <td className="border border-gray-300 px-4 py-2">1</td>
            <td className="border border-gray-300 px-4 py-2">30.000</td>
            <td className="border border-gray-300 px-4 py-2">30.000</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2">12</td>
            <td className="border border-gray-300 px-4 py-2">Jabón Dove</td>
            <td className="border border-gray-300 px-4 py-2">2</td>
            <td className="border border-gray-300 px-4 py-2">5.000</td>
            <td className="border border-gray-300 px-4 py-2">10.000</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2">23</td>
            <td className="border border-gray-300 px-4 py-2">Aceite capilar</td>
            <td className="border border-gray-300 px-4 py-2">1</td>
            <td className="border border-gray-300 px-4 py-2">20.000</td>
            <td className="border border-gray-300 px-4 py-2">20.000</td>
          </tr>
        </tbody>
      </table>
      <div className="flex justify-end">
        <button onClick={prevStep} className="bg-gray-500 text-white py-2 px-4 ml-2 rounded">Volver al Pago</button>
        <button /*onClick={}*/ className="bg-gray-500 text-white py-2 px-4 ml-2 rounded">Confirmar y Terminar</button>
      </div>
    </div>
  );
};

export default Step3;