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
    labels: data.map((gasto) => gasto.tipoOperacion.nombre.toUpperCase()),
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

  return (
    <div className="w-[450px] h-[350px] flex flex-col  justify-center items-start bg-gray-900 border border-primary-100 p-4 rounded-md">
      <Doughnut className="w-full" options={options} data={miData} />
    </div>
  );
}
