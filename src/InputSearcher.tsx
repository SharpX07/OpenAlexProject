import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Input.css';

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

interface Result {
    principal_value: string;
    secondary_value: number;
    terciary_value: number;
}

const InputPage: React.FC = () => {
    const query = useQuery();
    const searchValue = query.get('search');

    const [results, setResults] = useState<Result[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5000/autocomplete?query=${searchValue}&type=work`);
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

    return (
        <div>
            <h1>Resultados de la búsqueda</h1>
            <p>Buscaste: {searchValue}</p>
            <ul>
                {results.map((result, index) => (
                    <li key={index}>
                        <p><b>{result.principal_value}</b></p>
                        <p>Works Count: {result.secondary_value}</p>
                        <p>Cited By Count: {result.terciary_value}</p>
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
