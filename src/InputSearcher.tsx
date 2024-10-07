import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SearcherForm from './components/SearcherForm';
import { QueryResults, QueryResult } from './components/queryResults';
import OaPagination from './components/oaPagination';
import { BoxContainer } from './components/boxContainer';
import { OverlayCard } from './components/overlayCard';
import PieChartOpenAccess, { ResultPieChartOpenAccess } from "./components/pieOpenAccessChart";
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Group from './components/Group';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"


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



const InputPage: React.FC = () => {
    const query = useQuery();
    const searchValue = query.get('search');
    const [page, setPage] = useState(1);

    const [resultsLoading, setResultsLoading] = useState(true);
    const [queryResult, setQueryResult] = useState<QueryResult[]>([]);
    const [resultsError, setResultsError] = useState<Error | null>(null);


    useEffect(() => {
        if (searchValue) {
            fetchResults(setQueryResult, setResultsLoading, setResultsError, searchValue, page, 3, 'works');
        }
    }, [searchValue, page]);

    let lista = ["Art", "de", "dede", "dada", "aea"]

    return (
        <div className='bg-[#f2f0e8]' >
            <div className="bg-[#ffffff] flex flex-col justify-center items-center py-1 z-50"><SearcherForm></SearcherForm></div>
            <div><TopContainerMetrics searchValue={searchValue}>
            </TopContainerMetrics>
            </div>
            {/* {renderPagination()} */}
            {/* </BoxContainer> */}
            <div className="flex flex-row justify-between">
                <div className='w-[20%] px-4'>
                    <BoxContainer>
                        <Accordion type="single" defaultValue='item-1'>
                            <AccordionItem value="item-1">
                                <AccordionTrigger>TOPIC</AccordionTrigger>
                                <AccordionContent>
                                    {lista.map((result) => {
                                        return (<Group text={result}></Group>);
                                    })}
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger>INSTITUTION</AccordionTrigger>
                                <AccordionContent>
                                    {lista.map((result) => {
                                        return (<Group text={result}></Group>);
                                    })}
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                                <AccordionTrigger>TYPE</AccordionTrigger>
                                <AccordionContent>
                                    {lista.map((result) => {
                                        return (<Group text={result}></Group>);
                                    })}
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </BoxContainer>
                </div>
                <div className='w-[80%] pr-4'>
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
                    <div className="pt-3"><OaPagination page={page} setPage={setPage}/></div>
                    
                </div>
            </div>
        </div>
    );
};

export const Other: React.FC = () => {
    return <InputPage />;
};
