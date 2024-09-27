import { SetStateAction, useState } from 'react'
import Lupa from './assets/lupa.svg'
import { ReactSVG } from 'react-svg';
// import viteLogo from '/vite.svg'
import './App.css'






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