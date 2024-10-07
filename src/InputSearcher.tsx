import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SearcherForm from './components/SearcherForm';
import { QueryResults, QueryResult } from './components/queryResults';
import OaPagination from './components/oaPagination';
import { BoxContainer } from './components/boxContainer';
// import { OverlayCard } from './components/overlayCard';
import TopContainerMetrics from './components/TopContainerMetrics';
import { OverlayCard } from './components/overlayCard';
import { WorkCard } from './components/WorkCard';

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
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




const InputPage: React.FC = () => {
    const query = useQuery();
    const searchValue = query.get('search');
    const [page, setPage] = useState(1);

    const [resultsLoading, setResultsLoading] = useState(true);
    const [queryResult, setQueryResult] = useState<QueryResult[]>([]);
    const [resultsError, setResultsError] = useState<Error | null>(null);

    const [cardOpened, setCardOpened] = useState<boolean>(false);
    const [idCard, setIdCard] = useState<string>('');
    const [typeCard, setTypeCard] = useState<string>('');

    const openCard = (id: string, type: string) => {
        setCardOpened(true);
        setIdCard(id);
        setTypeCard(type); 
    }

    useEffect(() => {
        if (searchValue) {
            fetchResults(setQueryResult, setResultsLoading, setResultsError, searchValue, page, 3, 'works');
        }
    }, [searchValue, page]);

    return (
        <div className='bg-[#f2f0e8]'>
            <div className="bg-[#ffffff] flex flex-col justify-center items-center ">
                <SearcherForm />
            </div>
            <TopContainerMetrics searchValue={searchValue} />
            <BoxContainer>
                <h1>Resultados de la búsqueda</h1>
                <p>Buscaste: {searchValue}</p>

                {resultsLoading ? (
                    <p>Loading results...</p>
                ) : resultsError ? (
                    <p>Error loading results: {resultsError.message}</p>
                ) : (
                    <QueryResults results={queryResult} type="work" onClickItem={openCard} />
                )}
                <OaPagination page={page} setPage={setPage} />
            </BoxContainer>
            {cardOpened && (
                <WorkCard idCard={idCard} setCardOpened={setCardOpened} />
            )}
        </div>
    );
};

export const Other: React.FC = () => {
    return <InputPage />;
};
