import React from "react";

type MenuItem = {
  label: string;
  options: string[];
};

const menu: MenuItem[] = [
  {
    label: "Bancos",
    options: ["Todos","Banco Familiar", "Banco Vision", "Banco ITAU", "Banco Nacional de Fomento"],
  },
  {
    label: "Tipo de cta",
    options: ["Todos","Cuenta Corriente", "Cuenta de ahorro"],
  },
  {
    label: "Ver saldos",
    options: ["Todos", "Saldos A", "Saldos B", "Saldos C"],
  },
];

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center px-3 py-4 md:px-2 bg-primary-800 text-white">
      <h1 className="text-2xl font-bold">Cuentas</h1>
      <nav className="flex space-x-4">
        {menu.map((data, index) => (
          <div key={index} className="flex items-center">
            <h3 className="mr-2">{data.label}</h3>
            <select className="bg-primary-400 text-white py-1 px-2 rounded">
              {data.options.map((option, i) => (
                <option key={i}>{option}</option>
              ))}
            </select>
          </div>
        ))}
      </nav>
    </header>
  );
};

export default Header;
