import { Chart } from "react-google-charts";

export interface ResultPieChartOpenAccess {
    acceso: string;
    cantidad: number; // Cambia a number si tu API retorna un número
}

interface BarChartProps {
    results: ResultPieChartOpenAccess[];
}

export const pieChartOpenAccess: React.FC<BarChartProps> = ({ results }) => {
    // Manejar el caso donde no hay resultados
    if (results.length === 0) {
        return <p>No hay datos para mostrar.</p>;
    }

    // Crear el arreglo de datos para el gráfico
    const data = [["Acceso", "Cantidad"], ...results.map(result => [result.acceso, result.cantidad])]; // Asegúrate de que count sea un número
    
    const options = {
        title: "My Daily Activities",
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

// export default BarChart; // Exporta el componente para usarlo en otros archivos
// export default ResultPieChartOpenAccess