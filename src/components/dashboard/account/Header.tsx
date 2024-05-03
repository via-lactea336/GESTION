type MenuItem = {
  label: string;
  options: string[];
};

const menu: MenuItem[] = [
  {
    label: "Bancos",
    options: ["Todos"],
  },
  {
    label: "Tipo de cta",
    options: ["Todos"],
  },
  {
    label: "Ver saldos",
    options: ["Todos"],
  },
];

export default function Header() {
  return (
    <header className="flex h-full flex-col px-3 py-4 md:px-2">
      <h1>Cuentas</h1>
      <section>
        {menu.map((data, index) => (
          <div key={index}>
            <h3>{data.label}</h3>
            <select>
              {data.options.map((option, i) => (
                <option key={i}>{option}</option>
              ))}
            </select>
          </div>
        ))}
      </section>
    </header>
  );
}
