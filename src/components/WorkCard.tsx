import { BoxContainer } from './boxContainer';
import { OverlayCard } from './overlayCard';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea"

// "publication_year"
// "type"
// "source"
// "authorships"
// "primary_topic"
// "field"
// "subfield"
// "domain"

interface WorkData {
  publication_year: string;
  abstract: string;
  type: string;
  source: string;
  authorships: string[];
  primary_topic: string;
  field: string;
  subfield: string;
  domain: string;
  title: string;
  publication_date: string;
  cited_by_count: string;
}

interface WorkCardProps {
  // children: React.ReactNode; // Define que BoxContainer recibirá children
  idCard: string;
  setCardOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

const fetchWorkData = async (
  setResults: React.Dispatch<React.SetStateAction<WorkData | undefined>>,
  id: string
) => {
  try {
    const response = await fetch(`http://127.0.0.1:5000/get_work_info?id_query=${id}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: WorkData = await response.json();
    setResults(data);
  } catch (error) {

  } finally {

  }
};

export const WorkCard: React.FC<WorkCardProps> = ({ idCard, setCardOpened }) => {
  const [workData, setWorkData] = useState<WorkData | undefined>(undefined);

  useEffect(() => {
    if (idCard) {
      fetchWorkData(setWorkData, idCard);
    }
  }, [idCard]);

  if (workData === undefined) {
    return <p>Loading...</p>;
  }

  return (
    <OverlayCard>
      <h1 className="text-2xl font-bold mb-4">{workData.title}</h1>
      <div className='flex flex-row w-[100%] justify-around mb-2'>
        <div className='flex flex-col w-[100%] justify-stretch'>
          {/* Cited and Files */}
          <div className='flex flex-row w-[100%] justify-between mb-3'>
            {/* Cited */}
            <div className='mr-10 w-[100%]'>
              <BoxContainer background_color='d5bdaf'>
                <div className="text-black">
                  <p>Cited by: {workData.cited_by_count}</p>
                  <p>Publication year: {workData.publication_date}</p>
                </div>
              </BoxContainer>
            </div>
            <div className="flex flex-col justify-between ">
              <button className="bg-gray-200 px-4 min-w-[140px] py-2 rounded">HTML</button>
              <button className="bg-gray-200 px-4 min-w-[140px] py-2 rounded">PDF</button>
            </div>
          </div>

          {/* Data */}
          <BoxContainer background_color='49454f'>
            <div className='text-white'>
              <p>Year: {workData.publication_year}</p>
              <p>Type: {workData.type}</p>
              <p>Source: {workData.source}</p>
              <p>Authors: {workData.authorships.join(", ")}</p>
              {workData.primary_topic && (
                <>
                  <p>Primary Topic: {workData.primary_topic}</p>
                  <p>Field: {workData.field}</p>
                  <p>Subfield: {workData.subfield}</p>
                  <p>Domain: {workData.domain}</p>
                </>
              )}
            </div>
          </BoxContainer>
        </div>
        {/* Abstract */}
        {workData.abstract && (
          <div className='flex flex-col h-[500px] w-full ml-10'>
            <h2 className="text-xl font-bold mb-2">Abstract</h2>
            <p className='text-gray-700 overflow-hidden text-ellipsis'>
              {workData.abstract}
            </p>
          </div>
        )}
      </div>
      <Button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => setCardOpened(false)}>Cerrar</Button>
    </OverlayCard>
  );
};