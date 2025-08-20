import { Route, Routes } from 'react-router-dom';
import './App.css';
import DefaultLayout from './components/layout/DefaultLayout';
import MainPage from './page/MainPage';

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <DefaultLayout>
              <MainPage />
            </DefaultLayout>
          }
        />
      </Routes>
    </>
  );
}

export default App;
