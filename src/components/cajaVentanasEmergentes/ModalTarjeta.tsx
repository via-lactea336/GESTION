// components/ModalTarjeta.tsx

import React from "react";

interface ModalTarjetaProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tarjeta: {
    tipo: string;
    nombreTitular: string;
    banco: string;
  }) => void;
}

export default function ModalTarjeta({
  isOpen,
  onClose,
  onSave,
}: ModalTarjetaProps) {
  const [tipo, setTipo] = React.useState("Crédito");
  const [nombreTitular, setNombreTitular] = React.useState("");
  const [banco, setBanco] = React.useState("Banco Itaú");

  const handleSave = () => {
    onSave({ tipo, nombreTitular, banco });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-gray-700 p-6 rounded-md shadow-md w-1/3">
        <h2 className="text-xl font-semibold mb-4">Datos de la Tarjeta</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-white mb-2">
            Tipo de Tarjeta:
          </label>
          <select
            value={tipo}
            required
            onChange={(e) => setTipo(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-600 focus:border-primary-600 sm:text-sm"
          >
            <option value="Crédito">Crédito</option>
            <option value="Débito">Débito</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-white mb-2">
            Nombre del Titular:
          </label>
          <input
            type="text"
            required
            value={nombreTitular}
            onChange={(e) => setNombreTitular(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-600 focus:border-primary-600 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-white mb-2">
            Banco:
          </label>
          <select
            value={banco}
            required
            onChange={(e) => setBanco(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-600 focus:border-primary-600 sm:text-sm"
          >
            <option value="Banco Itaú">Banco Itaú</option>
            <option value="Banco Continental">Banco Continental</option>
            <option value="Banco Visión">Banco Visión</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-800 text-white py-2 px-4 rounded-md shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mr-2"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="bg-primary-700 text-white py-2 px-4 rounded-md shadow-sm hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
