import React from "react";

type MenuItem = {
  label: string;
  options: string[];
};

const menu: MenuItem[] = [
  {
    label: "Bancos",
    options: ["Todos", "Banco Familiar", "Banco Vision", "Banco ITAU"],
  },
  {
    label: "Tipo de cta",
    options: ["Todos", "Cuenta Corriente", "Cuenta de ahorro"],
  },
];

const Header: React.FC = () => {
  return (
    <header className="flex gap-3 justify-between items-center flex-wrap px-8 py-4 w-full rounded-md bg-primary-800 text-white">
      <h1 className="text-2xl font-bold">Cuentas</h1>
      <nav className="flex flex-wrap  items-center gap-3">
        {menu.map((data, index) => (
          <div key={index} className="flex items-center gap-3">
            <h3 className="mr-2">{data.label}</h3>
            <select className="bg-primary-400 text-white py-1 px-2 rounded-md">
              {data.options.map((option, i) => (
                <option key={i}>{option}</option>
              ))}
            </select>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <h3>Ver saldos</h3>
          <input
            type="checkbox"
            className="h-4 w-4 accent-primary-500 cursor-pointer"
          />
        </div>
      </nav>
    </header>
  );
};

export default Header;
