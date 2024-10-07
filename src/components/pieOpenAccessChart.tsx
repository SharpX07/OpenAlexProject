import { Chart } from "react-google-charts";

export interface ResultPieChartOpenAccess {
  open_count: number;
  total_count: number;
}

interface PieChartProps {
  results: ResultPieChartOpenAccess;
}

const PieChartOpenAccess: React.FC<PieChartProps> = ({ results }) => {
  // Crear el arreglo de datos para el gráfico
  const data = [
    ["Acceso", "Cantidad"],
    ["Open Access", results.open_count],
    ["Closed Access", results.total_count - results.open_count]
  ];

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

export default PieChartOpenAccess;
