import { SetStateAction, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Lupa from './assets/lupa.svg'
import { ReactSVG } from 'react-svg';
import './App.css'

<<<<<<< Updated upstream
import { Chart } from "react-google-charts";


export const data = [
  ["City", "2010 Population", "2000 Population"],
  ["New York City, NY", 8175000, 8008000],
  ["Los Angeles, CA", 3792000, 3694000],
  ["Chicago, IL", 2695000, 2896000],
  ["Houston, TX", 99099000, 1953000],
  ["Philadelphia, PA", 1526000, 1517000],
];

// Different options for non-material charts
export const options = {
  title: "Population of Largest U.S. Cities",
  chartArea: { width: "50%" },
  hAxis: {
    title: "Total Population",
    minValue: 0,
  },
  vAxis: {
    title: "City",
  },
};

// export function App() {
//   return (
    
//   );

=======
interface Result {
  principal_value: string,
  secondary_value: string,
  tertiary_value: string
}
>>>>>>> Stashed changes


const SearcherForm = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  
  const handleClick = () => {
    navigate(`/input?search=${searchValue}`);
  };
  const handleInputChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setSearchValue(event.target.value);
  };

  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    handleClick();
  };

  const [data, setData] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (searchValue.trim() === '') {
      setData([]);
      setLoading(false);
      setError(null);
      return;
    }
    const fetchData = async () => {
      try {
        const response = await fetch(`http://192.168.2.120:5000/autocomplete?query=${searchValue}&type=work`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: Result[] = await response.json();
        setData(data);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    if (searchValue) {
      fetchData();
    }
  }, [searchValue]);

  const resultAutocomplete = () => {
    if (searchValue == ""){
      return null
    }

    if (error) {
      return <p>Error: {error.message}</p>
    }
    if (loading) {
      return <p>Loading...</p>
    }

    return (<ul className='searcher-autocomplete-results'>
      {data.slice(0,5).map((result, index) => (
        <li className='searcher-autocomplete-item' key={index}>
          <p className='searcher-autocomplete-item-text'><b>{result.principal_value}</b></p>
          <p className='searcher-autocomplete-item-text'>Works Count: {result.secondary_value}</p>
          <p className='searcher-autocomplete-item-text'>Cited By Count: {result.tertiary_value}</p>
        </li>
      ))}
    </ul>)
  }

  return (
    <div className="container-searcher">
      <img className="logo" src="logo.png" alt="Logo" />
      <form className='form-searcher' onSubmit={handleSubmit}>
        <input
          className='form-searcher-input'
          placeholder='Buscar investigadores expertos en tu área...'
          value={searchValue}
          onChange={handleInputChange}
        />
        <button className='form-searcher-button' type='button' onClick={handleClick}>
          <ReactSVG src={Lupa} className="from-searcher-button-img" />
        </button>
      </form>
<<<<<<< Updated upstream
      <Chart
      // Bar is the equivalent chart type for the material design version.
      chartType="BarChart"
      width="100%"
      height="400px"
      data={data}
      options={options}
    />
=======
      {resultAutocomplete()}
>>>>>>> Stashed changes
    </div>
  );
};

const searcher = () => {
  return (
    <>
      <header>
      </header>
      {SearcherForm()}
      <footer className='footer-searcher'>
        Este site foi criado como parte de um projeto do curso de programação web na UFOP (Universidade Federal de Ouro Preto).
      </footer>

    </>
  )
};


export function App() {
  return (
    searcher()
  )
}