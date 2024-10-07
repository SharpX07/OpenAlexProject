import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SearcherForm from './components/SearcherForm';
import { QueryResults, QueryResult } from './components/queryResults';
import OaPagination from './components/oaPagination';
import { BoxContainer } from './components/boxContainer';
import Group from './components/Group';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { WorkCard } from './components/WorkCard';


// import { OverlayCard } from './components/overlayCard';
import TopContainerMetrics from './components/TopContainerMetrics';

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

interface FilterObject {
    name: string;
    count: string;
}

interface Filters {
    topic: FilterObject[];
    institution: FilterObject[];
    type: FilterObject[];
}


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

    const [filters, setFilters] = useState<Filters>();
    const [filtersLoading, setFiltersLoading] = useState(true);
    const [filtersError, setFiltersError] = useState<Error | null>(null);



    const openCard = (id: string, type: string) => {
        setCardOpened(true);
        setIdCard(id);
        setTypeCard(type);
    }

    useEffect(() => {
        if (searchValue) {
            fetchResults(setQueryResult, setResultsLoading, setResultsError, searchValue, page, 5, 'works');
            fetchFilters();

        }
    }, [searchValue, page]);

    // let lista = ["Art", "de", "dede", "dada", "aea"]
    const fetchFilters = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/get_results_filters?query=${searchValue}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: Filters = await response.json();
            setFilters(data);
        } catch (error) {
            setFiltersError(error instanceof Error ? error : new Error('Unknown error'));
        } finally {
            setFiltersLoading(false);
        }
    }

    return (
        <div className='bg-[#f2f0e8] flex flex-col justify-between h-screen' >
            <div className="bg-[#ffffff] flex flex-col justify-center items-center py-1 z-50"><SearcherForm></SearcherForm></div>
            <div><TopContainerMetrics searchValue={searchValue}>
            </TopContainerMetrics>
            </div>
            {/* {renderPagination()} */}
            {/* </BoxContainer> */}
            <div className="flex flex-row justify-between">
                <div className='w-[20%] px-4'>
                    <h1 className="font-semibold text-xl pl-2">Filter</h1>
                    <BoxContainer>
                        <Accordion type="single" defaultValue='item-1'>
                            <AccordionItem value="item-1">
                                <AccordionTrigger>TOPIC</AccordionTrigger>
                                <AccordionContent>
                                    {filters?.topic.map((result, index) => {
                                        if (index >= 5) {
                                            return null;
                                        }
                                        return (<Group text={result.name + " - [" + result.count + "]"}></Group>);
                                    })}
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger>INSTITUTION</AccordionTrigger>
                                <AccordionContent>
                                    {filters?.institution.map((result, index) => {
                                        if (index >= 5) {
                                            return null;
                                        }
                                        return (<Group text={result.name + " - [" + result.count + "]"}></Group>);
                                    })}
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                                <AccordionTrigger>TYPE</AccordionTrigger>
                                <AccordionContent>
                                    {filters?.type.map((result, index) => {
                                        if (index >= 5) {
                                            return null;
                                        }
                                        return (<Group text={result.name + " - [" + result.count + "]"}></Group>);
                                    })}
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </BoxContainer>
                </div>
                <div className='w-[80%] pr-4'>
                    <div className='flex'><h1 className="font-semibold text-xl pl-2">Works</h1><p className='content-end pl-2 text-sm'>Searched: {searchValue}</p>
                    </div>
                    <BoxContainer>

                        {resultsLoading ? (
                            <p>Loading results...</p>
                        ) : resultsError ? (
                            <p>Error loading results: {resultsError.message}</p>
                        ) : (
                            <QueryResults results={queryResult} type="work" onClickItem={openCard} />
                        )}
                    </BoxContainer>
                    <div className="p-2"><OaPagination page={page} setPage={setPage} /></div>

                </div>
            </div>
            {cardOpened && (
                <WorkCard idCard={idCard} setCardOpened={setCardOpened} />
            )}
        </div>
    );
};

export const Other: React.FC = () => {
    return <InputPage />;
};
