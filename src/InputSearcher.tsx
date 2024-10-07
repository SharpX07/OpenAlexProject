import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import BarChart from './components/barChart';
import SearcherForm from './components/SearcherForm';
import { ResultBarChart } from './components/barChart';
import { QueryResults, QueryResult } from './components/queryResults';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink
} from "@/components/ui/pagination"
import { BoxContainer } from './components/boxContainer';
import { OverlayCard } from './components/overlayCard';



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

    const renderPagination = () => {
        return (
            <Pagination>
                <PaginationContent>
                    {renderNumberPagination()}
                </PaginationContent>
            </Pagination>
        )
    }
    const renderNumberPagination = () => {
        const totalPages = 100; // Definir el número total de páginas
        const pageNumbers = [];

        for (let i = 1; i <= totalPages; i++) {
            if (i <= 2 || i >= totalPages - 1 || (i >= page - 1 && i <= page + 1)) {
                pageNumbers.push(
                    <PaginationItem key={i} className='bg-[#f2f0e8] border border-[#d5bdaf] rounded-[11px] p-0 m-0'>
                        <PaginationLink href="#" onClick={() => setPage(i)}>
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            } else if (i === 3 || i === totalPages - 2) {
                pageNumbers.push(<PaginationEllipsis key={i} />);
            }
        }

        return pageNumbers;
    };

    return (
        <div className='bg-[#f2f0e8]'>
            <SearcherForm></SearcherForm>
            
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
            {renderPagination()}
            </BoxContainer>
        </div>
    );
};

export const Other: React.FC = () => {
    return <InputPage />;
};
