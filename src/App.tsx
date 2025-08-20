import { Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import DefaultLayout from './components/layout/DefaultLayout';
import LoginPage from './page/LoginPage';
import HomePage from './page/HomePage';
import Nav from './components/common/Nav';
import ScrollToTop from './components/common/ScrollToTop';
import TopicSelectPage from './page/compose/TopicSelectPage';
import TopicWritePage from './page/compose/TopicWritePage';
import ResultPage from './page/compose/ResultPage';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* 로그인화면 */}
        <Route element={<DefaultLayout hasBottomNav={false} />}>
          <Route path="/" element={<LoginPage />} />
        </Route>

        {/* 홈화면 */}
        <Route element={<DefaultLayout noPadding bottomNav={<Nav />} />}>
          <Route path="/home" element={<HomePage />} />
        </Route>

        {/* 글쓰기 플로우 */}
        <Route element={<DefaultLayout hasBottomNav={false} />}>
          <Route path="/compose/:mode">
            <Route index element={<TopicSelectPage />} />
            <Route path="write" element={<TopicWritePage />} />
            <Route path="result" element={<ResultPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </>
  );
}
