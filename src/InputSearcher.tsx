import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Input.css';
import { Chart } from "react-google-charts";

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

interface Result {
    year: string;
    count: string;
}
// Different options for non-material charts
export const options = {
    title: "Population of Largest U.S. Cities",
    chartArea: { width: "50%" },
    hAxis: {
        title: "Total Population",
        minValue: 0,
    },
    vAxis: {
        title: "City",
    },
};

const InputPage: React.FC = () => {
    const query = useQuery();
    const searchValue = query.get('search');

    const [results, setResults] = useState<Result[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://192.168.3.192:5000/get_search_metrics?query=${searchValue}&type=work`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data: Result[] = await response.json();
                setResults(data);
            } catch (error) {
                setError(error as Error);
            } finally {
                setLoading(false);
            }
        };

        if (searchValue) {
            fetchData();
        }
    }, [searchValue]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }
    const data = [["Año", "Cantidad"]]
    results.map((result) => {
        data.push([result.year, result.count]);
    });
    
    return (
        <div>
            <Chart
                // Bar is the equivalent chart type for the material design version.
                chartType="BarChart"
                width="100%"
                height="400px"
                data={data}
                options={options}
            />
            <h1>Resultados de la búsqueda</h1>
            <p>Buscaste: {searchValue}</p>
            <ul>
                {results.map((result, index) => (
                    <li key={index}>
                        {/* <p><b>{result.principal_value}</b></p> */}
                        {/* <p>Works Count: {result.secondary_value}</p> */}
                        {/* <p>Cited By Count: {result.terciary_value}</p> */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export const Other: React.FC = () => {
    return (
        <InputPage />
    );
};
