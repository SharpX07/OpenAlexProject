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

export const renderPieChart = (results: ResultPieChartOpenAccess | undefined, chartLoading: boolean, chartError: Error | null) => {
  if (results === undefined) {
      return <p>No hay datos para mostrar.</p>;
  }
  return (
      <>
          {chartLoading ? (
              <p>Loading chart...</p>
          ) : chartError ? (
              <p>Error loading chart: {chartError.message}</p>
          ) : (
              <PieChartOpenAccess results={results}></PieChartOpenAccess>
          )}
      </>
  );
};

export default PieChartOpenAccess;
