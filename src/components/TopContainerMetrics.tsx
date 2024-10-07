import { useState, useEffect } from 'react';
import { BoxContainer } from './boxContainer';
import { ResultBarChart, renderBarChart } from './barChart';
import { ResultPieChartOpenAccess, renderPieChart } from "./pieOpenAccessChart";
import BarChart from './barChart';

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

interface TopContainerMetricsProps {
    searchValue: string | null;
}


const TopContainerMetrics: React.FC<TopContainerMetricsProps> = ({searchValue}) => {

    if (searchValue === null) {
        return null;
    }


    const [PiechartResult, setPiechartResult] = useState<ResultPieChartOpenAccess | undefined>(undefined);
    const [PiechartLoading, setPiechartLoading] = useState(true);
    const [PiechartError, setPiechartError] = useState<Error | null>(null);

    const [barchartResults, setBarchartResults] = useState<ResultBarChart[]>([]);
    const [chartError, setChartError] = useState<Error | null>(null);
    const [chartLoading, setChartLoading] = useState(true);
    
    useEffect(() => {
        if (searchValue) {
            fetchChart(setBarchartResults, setChartLoading, setChartError, searchValue);
        }
        if (searchValue) {
            fetchOpenAcess(setPiechartResult, setPiechartLoading, setPiechartError, searchValue);
        }
    }, [searchValue]);

    return (
        <div className="flex items-center justify-around py-8">
                <div className="w-[20%] h-[25%]">
                <BoxContainer>
                <BarChart results={barchartResults} />
                    {/* {renderBarChart(barchartResults, chartLoading, chartError)} */}
                </BoxContainer>
                </div>
                <div className="w-[20%] h-[25%]">
                <BoxContainer>
                {renderPieChart(PiechartResult, PiechartLoading, PiechartError)}
                </BoxContainer>
                </div>
                <div className="w-[20%] h-[25%]">
                <BoxContainer>
                    <h1 className='justify-around font-extrabold text-xl'>Informations:</h1>
                    <div className='leading-[2.5]'>
                        <p>Results:</p>
                        <p>Citations:</p>
                        <p>APC Sums:</p>    
                    </div>
                    <div className='flex items-center justify-around text-bold text-xl'>
                    <p>80000</p><p>7000</p>
                    </div> 
                    <div className='flex items-center justify-around text-xs'>
                    <p>Sums APC's paid (est)</p><p>Sums APC's list (est)</p>
                    </div>                   
                </BoxContainer>
                </div>
            </div>
    )
}

export default TopContainerMetrics;
// \n