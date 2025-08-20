import { Route, Routes } from 'react-router-dom';
import './App.css';
import DefaultLayout from './components/layout/DefaultLayout';
import LoginPage from './page/LoginPage';
import HomePage from './page/HomePage';

function App() {
  return (
    <>
      <Routes>
        <Route element={<DefaultLayout hasBottomNav={false} />}>
          <Route path="/" element={<LoginPage />} />
        </Route>

        <Route element={<DefaultLayout noPadding />}>
          <Route path="/home" element={<HomePage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
