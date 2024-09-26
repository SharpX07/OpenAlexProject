import { SetStateAction, useState } from 'react'
import Lupa from './assets/lupa.svg'
import { ReactSVG } from 'react-svg';
// import viteLogo from '/vite.svg'
import './App.css'

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



const SearcherForm = () => {
  const [searchValue, setSearchValue] = useState('');

  const [mensajeFlask, setEstadisticas] = useState('');

  const handleInputChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setSearchValue(event.target.value);
  };

  const handleClick = () => {
    window.location.href = `/input?search=${searchValue}`;
  };

  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    handleClick();
    // obtenerEstadisticas();
    // console.log(mensajeFlask);
  };

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
      <Chart
      // Bar is the equivalent chart type for the material design version.
      chartType="BarChart"
      width="100%"
      height="400px"
      data={data}
      options={options}
    />
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