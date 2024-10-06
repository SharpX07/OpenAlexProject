import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Input.css';
import BarChart from './components/barChart';
import {ResultBarChart} from './components/barChart';
import {QueryResults,QueryResult} from './components/queryResults';
import { pieChartOpenAccess, ResultPieChartOpenAccess } from './components/pieOpenAccessChart';



const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const fetchChart = async (
    setResults: React.Dispatch<React.SetStateAction<ResultBarChart[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setError: React.Dispatch<React.SetStateAction<Error | null>>,
    searchValue: string
) => {
    setLoading(true); // Set loading to true at the start
    try {
        const response = await fetch(`http://127.0.0.1:5000/get_search_metrics?query=${searchValue}&type=works`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data: ResultBarChart[] = await response.json();
        setResults(data);
    } catch (error) {
        setError(error instanceof Error ? error : new Error('Unknown error'));
    } finally {
        setLoading(false); // Set loading to false after fetching
    }
};

const fetchPieChart = async (
    setResults: React.Dispatch<React.SetStateAction<ResultBarChart[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setError: React.Dispatch<React.SetStateAction<Error | null>>,
    searchValue: string
) => {
    setLoading(true); // Set loading to true at the start
    try {
        const response = await fetch(`http://192.168.2.120:5000/get_search_metrics?query=${searchValue}&type=work`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data: ResultBarChart[] = await response.json();
        setResults(data);
    } catch (error) {
        setError(error instanceof Error ? error : new Error('Unknown error'));
    } finally {
        setLoading(false); // Set loading to false after fetching
    }
};

const fetchResults = async (
    setResults: React.Dispatch<React.SetStateAction<QueryResult[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setError: React.Dispatch<React.SetStateAction<Error | null>>,
    searchValue: string
) => {
    setLoading(true); // Set loading to true at the start
    try {
        const response = await fetch(`http://127.0.0.1:5000/results?query=${searchValue}&type=works&per_page=3&page=2`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data: QueryResult[] = await response.json();
        setResults(data);
    } catch (error) {
        setError(error instanceof Error ? error : new Error('Unknown error'));
    } finally {
        setLoading(false); // Set loading to false after fetching
    }
};

const InputPage: React.FC = () => {
    const query = useQuery();
    const searchValue = query.get('search');

    const [barchartResults, setbarchartResults] = useState<ResultBarChart[]>([]);
    const [queryResult, setqueryResult] = useState<QueryResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (searchValue) {
            fetchChart(setbarchartResults, setLoading, setError, searchValue);
            fetchResults(setqueryResult, setLoading, setError, searchValue);
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
            <BarChart results={barchartResults} />
            <h1>Resultados de la búsqueda</h1>
            <p>Buscaste: {searchValue}</p>
            <QueryResults results={queryResult} type="work" />
        </div>
    );
};

export const Other: React.FC = () => {
    return <InputPage />;
};
