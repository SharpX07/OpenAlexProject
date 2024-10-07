import { useState, useEffect } from 'react';
import { BoxContainer } from './boxContainer';
import { ResultBarChart, renderBarChart } from './barChart';
import { ResultPieChartOpenAccess, renderPieChart } from "./pieOpenAccessChart";
import BarChart from './barChart';
import { InformationBox, ResultInformation } from './informationBox'

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
        setResults(data);
    } catch (error) {
        setError(error instanceof Error ? error : new Error('Unknown error'));
    } finally {
        setLoading(false);
    }
}

const fetchInformation = async (
    setResults: React.Dispatch<React.SetStateAction<ResultInformation | undefined>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setError: React.Dispatch<React.SetStateAction<Error | null>>,
    searchValue: string,
) => {
    setLoading(true);
    try {
        const response = await fetch(`http://127.0.0.1:5000/get_information_results?query=${searchValue}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data: ResultInformation = await response.json();
        setResults(data);
    } catch (error) {
        setError(error instanceof Error ? error : new Error('Unknown error'));
    } finally {
        setLoading(false);
    }
}



interface TopContainerMetricsProps {
    searchValue: string | null;
}


const TopContainerMetrics: React.FC<TopContainerMetricsProps> = ({ searchValue }) => {

    if (searchValue === null) {
        return null;
    }

    const [PiechartResult, setPiechartResult] = useState<ResultPieChartOpenAccess | undefined>(undefined);
    const [PiechartLoading, setPiechartLoading] = useState(true);
    const [PiechartError, setPiechartError] = useState<Error | null>(null);

    const [barchartResults, setBarchartResults] = useState<ResultBarChart[]>([]);
    const [chartError, setChartError] = useState<Error | null>(null);
    const [chartLoading, setChartLoading] = useState(true);

    const [informationResults, setInformationResults] = useState<ResultInformation | undefined>(undefined);
    const [informationLoading, setInformationLoading] = useState(true);
    const [informationError, setInformationError] = useState<Error | null>(null);

    useEffect(() => {
        if (searchValue) {
            fetchChart(setBarchartResults, setChartLoading, setChartError, searchValue);
        }
        if (searchValue) {
            fetchOpenAcess(setPiechartResult, setPiechartLoading, setPiechartError, searchValue);
        }
        if (searchValue) {
            fetchInformation(setInformationResults, setInformationLoading, setInformationError, searchValue);
        }
    }, [searchValue]);

    return (
        <div className="flex items-center justify-around py-5">
            <div className="w-[20%] h-[25%]">
                <BoxContainer>
                    {/* <BarChart results={barchartResults} /> */}
                    {renderBarChart(barchartResults, chartLoading, chartError)}
                </BoxContainer>
            </div>
            <div className="w-[20%] h-[25%]">
                <BoxContainer>
                    {renderPieChart(PiechartResult, PiechartLoading, PiechartError)}
                </BoxContainer>
            </div>
            <InformationBox results={informationResults
            }></InformationBox>
        </div>
    )
}

export default TopContainerMetrics;
// \n