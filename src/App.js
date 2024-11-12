import logo from './logo.svg';
import './App.css';
import InputSection from './components/InputSection';
import Output from './components/Output';

function App() {
  return (
    <div className="flex flex-col justify-center items-center sm:flex-row bg-gray-300 h-screen">
      <InputSection />
      <Output />
    </div>
  );
}

export default App;
