import SearcherForm from './components/SearcherForm';

const searcher = () => {
  return (
    <div className="bg-[#f1efe7] min-h-screen m-0 p-0 flex flex-col h-[100vh]">
      <header>
      </header>

      <div className="flex flex-col justify-center items-center h-[90vh]">
        <img className="w-1/5 max-w-[100px] h-auto mb-5" src="logo.png" alt="Logo" />
        <SearcherForm></SearcherForm>
      </div>
      <footer className='text-center px-5 pb-5'>
        Este site foi criado como parte de um projeto do curso de programação web na UFOP (Universidade Federal de Ouro Preto).
      </footer>

    </div>
  )
};


export function App() {
  return (
    searcher()
  )
}