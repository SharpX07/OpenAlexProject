import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import BarChart from './components/barChart';
import SearcherForm from './components/SearcherForm';
import { ResultBarChart } from './components/barChart';
import { QueryResults, QueryResult } from './components/queryResults';
import OaPagination from './components/oaPagination';
import { BoxContainer } from './components/boxContainer';
import { OverlayCard } from './components/overlayCard';
import PieChartOpenAccess, { ResultPieChartOpenAccess } from "./components/pieOpenAccessChart";




const useQuery = () => {
    return new URLSearchParams(useLocation().search);

};

const fetchChart = async (
    setResults: React.Dispatch<React.SetStateAction<ResultBarChart[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setError: React.Dispatch<React.SetStateAction<Error | null>>,
    searchValue: string
) => {
    setLoading(true);
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
        setLoading(false);
    }
};

const fetchOpenAcess = async (
    setResults: React.Dispatch<React.SetStateAction<ResultPieChartOpenAccess | undefined>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setError: React.Dispatch<React.SetStateAction<Error | null>>,
    searchValue: string,
) => {
    setLoading(true);
    try {
        const response = await fetch(`http://127.0.0.1:5000/get_search_openaccess?query=${searchValue}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data: ResultPieChartOpenAccess = await response.json();
        setResults(data); // Aquí está bien
    } catch (error) {
        setError(error instanceof Error ? error : new Error('Unknown error'));
    } finally {
        setLoading(false);
    }
}



const fetchResults = async (
    setResults: React.Dispatch<React.SetStateAction<QueryResult[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setError: React.Dispatch<React.SetStateAction<Error | null>>,
    searchValue: string,
    page: number = 1,
    per_page: number = 3,
    type: string = 'works'
) => {
    setLoading(true);
    try {
        const response = await fetch(`http://127.0.0.1:5000/results?query=${searchValue}&type=${type}&per_page=${per_page}&page=${page}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data: QueryResult[] = await response.json();
        setResults(data);
    } catch (error) {
        setError(error instanceof Error ? error : new Error('Unknown error'));
    } finally {
        setLoading(false);
    }
};

const renderBarChart = (results: ResultBarChart[], chartLoading: boolean, chartError: Error | null) => {
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


const renderPieChart = (results: ResultPieChartOpenAccess | undefined, chartLoading: boolean, chartError: Error | null) => {
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


const InputPage: React.FC = () => {
    const query = useQuery();
    const searchValue = query.get('search');
    const [page, setPage] = useState(1);
    const [barchartResults, setBarchartResults] = useState<ResultBarChart[]>([]);
    const [queryResult, setQueryResult] = useState<QueryResult[]>([]);
    const [chartLoading, setChartLoading] = useState(true);
    const [resultsLoading, setResultsLoading] = useState(true);
    const [chartError, setChartError] = useState<Error | null>(null);
    const [resultsError, setResultsError] = useState<Error | null>(null);
    const [PiechartResult, setPiechartResult] = useState<ResultPieChartOpenAccess| undefined>(undefined);
    const [PiechartLoading, setPiechartLoading] = useState(true);
    const [PiechartError, setPiechartError] = useState<Error | null>(null);

    useEffect(() => {
        if (searchValue) {
            fetchChart(setBarchartResults, setChartLoading, setChartError, searchValue);
        }
    }, [searchValue]);

    useEffect(() => {
        if (searchValue) {
            fetchResults(setQueryResult, setResultsLoading, setResultsError, searchValue, page, 3, 'works');
        }
    }, [searchValue, page]);

    useEffect(() => {
        if (searchValue) {
            fetchOpenAcess(setPiechartResult, setPiechartLoading, setPiechartError, searchValue);
        }
    }, [searchValue]);



    return (
        <div className='bg-[#f2f0e8]'>
            <div className="bg-[#ffffff] flex flex-col justify-center items-center "><SearcherForm></SearcherForm></div>
            <div className="flex items-center justify-around">
                <BoxContainer>
                    <h1>Resultados de la búsqueda</h1>
                    <p>Buscaste: {searchValue}</p>

                    {resultsLoading ? (
                        <p>Loading results...</p>
                    ) : resultsError ? (
                        <p>Error loading results: {resultsError.message}</p>
                    ) : (
                        <QueryResults results={queryResult} type="work" />
                    )}
                </BoxContainer>
                <BoxContainer>
                    {renderBarChart(barchartResults, chartLoading, chartError)}
                </BoxContainer>
                {/* <BoxContainer>
                </BoxContainer>
               */}
                <OverlayCard>
                    {renderPieChart(PiechartResult, PiechartLoading, PiechartError)}
                </OverlayCard>
            </div>
            <OaPagination page={page} setPage={setPage} />
            {/* {renderPagination()} */}
            {/* </BoxContainer> */}
        </div>
    );
};

export const Other: React.FC = () => {
    return <InputPage />;
};
