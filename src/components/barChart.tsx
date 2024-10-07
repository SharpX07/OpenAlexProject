import { Chart } from "react-google-charts";
import { color } from "react-magic-motion";

export interface ResultBarChart {
    year: string;
    count: string; // Cambia a number si tu API retorna un número
}

interface BarChartProps {
    results: ResultBarChart[];
}

const BarChart: React.FC<BarChartProps> = ({ results }) => {
    // Manejar el caso donde no hay resultados
    if (results.length === 0) {
        return <p>No hay datos para mostrar.</p>;
    }

    // Crear el arreglo de datos para el gráfico
    const data = [["Año", "Cantidad"], ...results.map(result => [result.year, parseInt(result.count)])]; // Asegúrate de que count sea un número

    const options = {
        chartArea: { width: "50%" },
        hAxis: {
            title: "Cantidad",
            minValue: 0,
        },
        title: "YEAR",
        legend: { position: "none" },
        colors: ["#826c4a"],
        vAxis: {
            title: "Año",
        },
    };

    return (
        <Chart
            chartType="BarChart"
            width="100%"
            data={data}
            options={options}
        />
    );
};

export const renderBarChart = (results: ResultBarChart[], chartLoading: boolean, chartError: Error | null) => {
    if (results.length === 0) {
        return <p>No hay datos para mostrar.</p>;
    }
    return (
        <>
            {chartLoading ? (
                <p>Loading chart...</p>
            ) : chartError ? (
                <p>Error loading chart: {chartError.message}</p>
            ) : (
                <BarChart results={results} />
            )}
        </>
    );
};


export default BarChart; // Exporta el componente para usarlo en otros archivos
// export default ResultBarChart