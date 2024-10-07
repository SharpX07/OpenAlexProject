import { SetStateAction, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Lupa from '/src/assets/lupa.svg'
import { ReactSVG } from 'react-svg';
// import './App.css'

interface Result {
  principal_value: string,
  secondary_value: string,
  id: string
}

const SearcherForm = () => {
  let isid = false;

  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [data, setData] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedType, setSelectedType] = useState('works');


  const handleClick = () => {
    navigate(`/input?search=${searchValue}&selectedType=${selectedType}&isid=${isid}`);
    setSearchValue('');
  };

  const handleSearchSelection = (type: string, id: string) => {
    setSelectedType(type);
    setSearchValue(id);
    isid = true;
    handleClick();
  };

  const handleInputChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setSearchValue(event.target.value);
  };

  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    handleClick();
  };

  useEffect(() => {
    if (searchValue.trim() === '') {
      setData([]);
      setLoading(false);
      setError(null);
      setIsVisible(false);

      return;
    }
    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/autocomplete?query=${searchValue}&type=${selectedType.toLowerCase()}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: Result[] = await response.json();
        setData(data);
      } catch (error) {
        setError(error as Error);
      } finally {
        setIsVisible(true);
        setLoading(false);
      }
    };

    if (searchValue) {
      fetchData();
    }
  }, [searchValue, loading, error, selectedType]);

  const resultAutocomplete = () => {
    if (searchValue.trim() === '') {
      return null;
    }
    if (error) {
      return <p>Error: {error.message}</p>;
    }
    if (loading) {
      return <p>Loading...</p>;
    }

    const typeBullet = (text: string) => {
      const textLower = text.toLowerCase();
      const isSelected = selectedType?.toLowerCase() === textLower;

      return <div
        className={`h-[1%] p-1 m-2 rounded-[20px] border border-[#d5bdaf] ${isSelected ? 'bg-[#d5bdaf]' : 'bg-[#eeeeed]'} cursor-pointer hover:bg-[#d5bdaf] transition-colors duration-200`}
        onClick={() => { setSelectedType(text) }}>
        <p className='text-x truncate text-left pl-2 pr-2'><b>{text}</b></p>
      </div>
    }

    if (data.length === 0) {
      return null;
    }

    return (
      <div className='border'>
        <ul className={`absolute flex p-0 m-0 bg-[#f8f8f7] border border-[#D5BDAF] 
          ${isVisible ? 'opacity-100 translate-y-[0px] w-[100%] -translate-x-[1px]' : 'opacity-[50px] -translate-y-4 -translate-x-[1px]'}`}>
          {typeBullet("Works")}
          {typeBullet("Institutions")}
          {typeBullet("Authors")}
        </ul>
        <ul className={`absolute w-full m-0 border border-[#D5BDAF] bg-[#f8f8f7] rounded-b-[20px] transition-all duration-300 ease-in-out ${isVisible ? 'opacity-100 translate-y-[50px] -translate-x-[1px]' : 'opacity-[50px] -translate-y-4 -translate-x-[1px]'}`}>
          {data.slice(0, 5).map((result, index) => (
            <li className='h-[1%] p-2 m-0 rounded-none bg-transparent hover:bg-[#d5bdaf]' key={index} onClick={() => handleSearchSelection(selectedType, result.id)}>
              <p className='text-x truncate text-left text-x font-sans font-light'><b>{result.principal_value}</b></p>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <form className='w-[90%] flex max-w-[600px]' onSubmit={handleSubmit}>
      <div className="relative w-full">
        <input
          className={`font-sans bg-[#f8f8f7] border border-[#D5BDAF] text-black w-full h-[40px] px-4 py-2 ${isVisible ? 'rounded-t-[12px]' : 'rounded-[12px]'} focus:outline-none pr-[40px]`} // Aumentar padding a la derecha
          type='text'
          placeholder='Procure pesquisadores especializados em sua área...'
          value={searchValue}
          onChange={handleInputChange}
        />
        <button className='absolute right-2 -translate-y-[38px] bg-transparent border-none rounded-[5px] flex items-center justify-center p-2 hover:bg-[#2d3336]' type='button' onClick={handleClick}>
          <ReactSVG src={Lupa} className="w-[20px] h-[20px] text-[rgb(120,220,220)]" />
        </button>
        {resultAutocomplete()}
      </div>
    </form>
  );
};
export default SearcherForm;