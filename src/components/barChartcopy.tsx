import { Chart } from "react-google-charts";

export interface ResultBarChart {
    year: string;
    count: string; // Cambia a number si tu API retorna un número
}

interface BarChartProps {
    results: ResultBarChart[];
}

const pieXD: React.FC<BarChartProps> = ({ results }) => {
    // Manejar el caso donde no hay resultados
    if (results.length === 0) {
        return <p>No hay datos para mostrar.</p>;
    }

    // Crear el arreglo de datos para el gráfico
    const data = [["Año", "Cantidad"], ...results.map(result => [result.year, parseInt(result.count)])]; // Asegúrate de que count sea un número

    const options = {
        title: "Resultados de la búsqueda",
        chartArea: { width: "50%" },
        hAxis: {
            title: "Cantidad",
            minValue: 0,
        },
        vAxis: {
            title: "Año",
        },
    };

    return (
        <Chart
            chartType="BarChart"
            width="100%"
            height="400px"
            data={data}
            options={options}
        />
    );
};

export default pieXD; // Exporta el componente para usarlo en otros archivos
// export default ResultBarChart