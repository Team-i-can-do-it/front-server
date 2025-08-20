import { Route, Routes } from 'react-router-dom';
import './App.css';
import DefaultLayout from './components/layout/DefaultLayout';
import LoginPage from './page/LoginPage';

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <DefaultLayout>
              <LoginPage />
            </DefaultLayout>
          }
        />
      </Routes>
    </>
  );
}

export default App;
