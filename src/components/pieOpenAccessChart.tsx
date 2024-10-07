import { Chart } from "react-google-charts";

export interface ResultPieChartOpenAccess {
  open_count: string;
  total_count: number; // Cambia a number si tu API retorna un número
}

interface PieChartProps {
    results: ResultPieChartOpenAccess[];
}

export const pieChartOpenAccess: React.FC<PieChartProps> = ({ results }) => {
    // Manejar el caso donde no hay resultados
    if (results.length === 0) {
        return <p>No hay datos para mostrar.</p>;
    }

    // Crear el arreglo de datos para el gráfico
    const data = [["Acceso", "Cantidad"], ...results.map(result => [result.open_count, result.total_count])]; // Asegúrate de que count sea un número
    
    const options = {
        title: "Open Access",
      };
    return (
      <Chart
        chartType="PieChart"
        data={data}
        options={options}
        width={"100%"}
        height={"400px"}
      />
    );
};
