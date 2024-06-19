"use client";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Balance } from "@/lib/utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function BarChart({ balances }: { balances: Balance[] }) {
  const chartHeight = 302;

  if (!Array.isArray(balances)) {
    // Manejar el caso en el que balances no es un array
    return <p className="mt-4 text-gray-400">No hay datos disponibles</p>;
  }

  // Paleta de colores claros distintivos
  const colorPalette = [
    "rgba(84, 46, 155, 1)", // #542e9b
    "rgba(255, 99, 132, 1)", // Rosa
    "rgba(54, 162, 235, 1)", // Azul
    "rgba(255, 206, 86, 1)", // Amarillo
    "rgba(75, 192, 192, 1)", // Verde Agua
    "rgba(153, 102, 255, 1)", // Violeta
    "rgba(255, 159, 64, 1)", // Naranja
  ];

  // Ajustar la cantidad de colores según la cantidad de datos
  const backgroundColors = balances.map(
    (_, index) => colorPalette[index % colorPalette.length]
  );

  const data = {
    labels: balances.map((balance) => balance.cuenta),
    datasets: [
      {
        label: "Saldo de Cuenta",
        borderWidth: 0,
        barThickness: 30,
        data: balances.map((balance) => balance.saldo),
        backgroundColor: backgroundColors, // Color con opacidad
      },
    ],
  };

  const options = {
    color: "white",
    indexAxis: "y" as "x" | "y" | undefined, // Esto hace que el gráfico sea horizontal
    responsive: true,
    maintainAspectRatio: false,
    borderWidth: 0,

    plugins: {
      legend: {
        display: false, // Oculta la leyenda
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          color: "white", // Cambia el color del texto de las etiquetas del eje X a blanco
          font: {
            size: 15, // Cambia el tamaño del texto de las etiquetas del eje X
          },
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "white", // Cambia el color del texto de las etiquetas del eje Y a blanco
          font: {
            size: 15, // Cambia el tamaño del texto de las etiquetas del eje X
          },
        },
      },
    },
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <h3 className={`mb-4 text-lg text-white`}>Saldo de Cuentas Bancarias</h3>
      <div className="rounded-md bg-gray-900 p-4 border border-gray-100 h-[224px]">
        <Bar data={data} options={options} height={chartHeight} />
      </div>
    </div>
  );
}
