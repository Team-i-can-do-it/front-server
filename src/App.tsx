import './App.css';
import DefaultLayout from './components/layout/DefaultLayout';

function App() {
  return (
    <DefaultLayout>
      <div className="flex justify-center items-center bg-purple-50 w-40 h-40">
        Hello world
      </div>
    </DefaultLayout>
  );
}

export default App;
