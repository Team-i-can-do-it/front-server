import { Route, Routes } from 'react-router-dom';
import './App.css';
import DefaultLayout from './components/layout/DefaultLayout';
import LoginPage from './page/LoginPage';
import HomePage from './page/HomePage';
import Nav from './components/common/Nav';
import ScrollToTop from './components/common/ScrollToTop';

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<DefaultLayout hasBottomNav={false} />}>
          <Route path="/" element={<LoginPage />} />
        </Route>

        <Route element={<DefaultLayout noPadding bottomNav={<Nav />} />}>
          <Route path="/home" element={<HomePage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
