import { Route, Routes, Navigate, useParams, Outlet } from 'react-router-dom';
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
import SummaryPanel from './page/compose/result/SummaryPanel';
import AnalysisPanel from './page/compose/result/AnalysisPanel';

function ComposeModeGuard() {
  const { mode } = useParams();
  if (mode !== 'topic' && mode !== 'sentence')
    return <Navigate to="/" replace />;
  return <Outlet />;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* 0) 로그인: 첫 화면은 "/" */}
        <Route element={<DefaultLayout hasBottomNav={false} />}>
          <Route path="/" element={<LoginPage />} />
        </Route>

        {/* 1) 홈 */}
        <Route element={<DefaultLayout noPadding bottomNav={<Nav />} />}>
          <Route path="/home" element={<HomePage />} />
        </Route>

        {/* 2) 글쓰기 플로우 */}
        {/* 주제 선택 (헤더 A) */}
        <Route
          element={
            <DefaultLayout
              hasBottomNav={false}
              header={<Header title="" showBack sticky frosted />}
            />
          }
        >
          <Route element={<ComposeModeGuard />}>
            <Route path="/compose/:mode" element={<TopicSelectPage />} />
          </Route>
        </Route>

        {/* 작성/결과 (헤더 B) */}
        <Route
          element={
            <DefaultLayout
              hasBottomNav={false}
              header={<Header showBack right={<CloseTo to="/home" />} />}
            />
          }
        >
          <Route element={<ComposeModeGuard />}>
            <Route path="/compose/:mode/write" element={<TopicWritePage />} />

            {/* 결과 + 중첩 탭 */}
            <Route path="/compose/:mode/result" element={<ResultPage />}>
              <Route index element={<Navigate to="summary" replace />} />
              <Route path="summary" element={<SummaryPanel />} />
              <Route path="analysis" element={<AnalysisPanel />} />
            </Route>
          </Route>
        </Route>

        {/* 404 → 첫 화면 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
