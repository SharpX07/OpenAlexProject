import { BoxContainer } from './boxContainer';


export interface ResultInformation {
  count: number;
}

interface InformationBoxtProps {
  results: ResultInformation | undefined;
}

export const InformationBox: React.FC<InformationBoxtProps> = ({ results }) => {
  return (
    <div className="w-[20%] h-[25%]">
    <BoxContainer>
        <h1 className='justify-around font-extrabold text-xl'>Informations:</h1>
        <div className='leading-[2.5]'>
          {results && (
            <p>Results: {results.count}</p>
          )}
        </div>
    </BoxContainer>
</div>
  );
};

export default InformationBox;
