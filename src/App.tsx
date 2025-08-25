import './App.css';
import DefaultLayout from './components/layout/DefaultLayout';

function App() {
  return (
    <DefaultLayout>
      <div className="flex justify-center items-center bg-violet-50 bg w-40 h-40">
        Hello world
      </div>

      <div className="items-center justify-center flex bg-amber-200 w-40 h-40 text-white-base">
        test
      </div>
    </DefaultLayout>
  );
}

export default App;
