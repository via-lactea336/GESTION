"use client";
import { ArcElement, Legend, Tooltip, Chart as ChartJS } from "chart.js";
import { Doughnut } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
  data: {
    tipoOperacion: {
      nombre: string;
    };
    monto: number;
  }[];
};

export function DonutChart({ data }: Props) {
  const borderColor = [
    "rgba(84, 46, 155, 0.1)",
    "rgba(255, 99, 132, 0.1)",
    "rgba(54, 162, 235, 0.1)",
    "rgba(255, 206, 86, 0.1)",
    "rgba(75, 192, 192, 0.1)",
    "rgba(153, 102, 255, 0.1)",
    "rgba(255, 159, 64, 0.1)",
  ];

  // Paleta de colores claros distintivos
  const colorPalette = [
    "rgba(84, 46, 155, 1)", // #542e9b
    "rgba(255, 99, 132, 1)", // Rosa
    "rgba(54, 162, 235, 1)", // Azul
    "rgba(255, 206, 86, 1)", // Amarillo
    "rgba(75, 192, 192, 1)", // Verde Agua
    "rgba(153, 102, 255,1)", // Violeta
    "rgba(255, 159, 64, 1)", // Naranja
  ];

  // Ajustar la cantidad de colores según la cantidad de datos
  const backgroundColors = data.map((_, index) => {
    return colorPalette[index % colorPalette.length];
  });

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    color: "white",
  };
  const miData = {
    datasets: [
      {
        data: data.map((gasto) => gasto.monto),
        label: "Importe total",
        borderWidth: 1,
        backgroundColor: backgroundColors,
        borderColor: borderColor,
      },
    ],
  };

  const replacements: { [key: string]: string } = {
    Retiro: "Retiro",
    "DEBITO BANCARIO": "Débito",
    "TRANSFERENCIA (EMITIDA)": "Transferencia",
    "Emitir Cheque": "Emisión de cheque",
    "CONCILIACION DE CHEQUE": "Conciliación",
    "ANULACION DE CHEQUE": "Anulación de cheque",
  };

  const getReplacedName = (originalName: string): string => {
    return replacements[originalName] || originalName;
  };

  return (
    <section className="flex flex-col gap-2 w-full">
      <h3 className="text-lg font-semibold">
        Importe de Gastos por Tipo de Operación
      </h3>
      <div className="bg-gray-900 border border-primary-100 p-4 rounded-md flex items-center">
        <div className="w-[290px] h-[190px]">
          <Doughnut
            className="w-full relative"
            options={options}
            data={miData}
          />
        </div>
        <ul>
          {data.map((gasto, index) => (
            <li key={index} className="flex items-center gap-x-2 gap-y-4">
              <span
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: backgroundColors[index] }}
              ></span>
              <span>{getReplacedName(gasto.tipoOperacion.nombre)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
