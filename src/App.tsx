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
import Header from './components/common/Header';
import CloseTo from './components/common/CloseTo';

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
        <Route
          element={
            <DefaultLayout
              hasBottomNav={false}
              header={<Header title="" showBack sticky frosted />}
            />
          }
        >
          <Route path="/compose/:mode" element={<TopicSelectPage />} />
        </Route>

        <Route
          element={
            <DefaultLayout
              hasBottomNav={false}
              header={<Header showBack right={<CloseTo to="/home" />} />}
            />
          }
        >
          <Route path="/compose/:mode/write" element={<TopicWritePage />} />
        </Route>
        {/* 결과: 평가 점수 및 피드백(X 버튼) */}
        <Route
          element={
            <DefaultLayout
              hasBottomNav={false}
              header={<Header showBack right={<CloseTo to="/home" />} />}
            />
          }
        >
          <Route path="/compose/:mode/result" element={<ResultPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </>
  );
}
