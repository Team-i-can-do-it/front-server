import './App.css';
import DefaultLayout from '@_layout/DefaultLayout';
import DesignTest from '@_page/DesignTest';
import { Routes, Route } from 'react-router-dom';
import Header from '@_layout/Header';
import BottomNav from '@_components/layout/BottomNav';
import WelcomePage from '@_page/WelcomePage';
import HomePage from '@_page/HomePage';
import TopicSelectPage from '@_page/TopicSelectPage';
import ComposePage from '@_page/ComposePage';
import AdminPage from '@_page/AdminPage.tsx';
import ModalProvider from '@_components/common/ModalProvider';
import NotFoundPage from '@_page/NotFoundPage';
import ToastProvider from '@_components/common/Toast/ToastProvider';
import ResultPage from '@_page/ResultPage';
import ParagraphPage from '@_page/ParagraphPage';
import LoadingPage from '@_page/LoadingPage';
import HistoryPage from '@_page/HistoryPage';
import GachaPage from '@_page/GachaPage';
import ProductDetails from '@_components/pageComponent/gacha/ProductDetails';

function App() {
  return (
    <>
      <Routes>
        {/* 헤더/네비 x 페이지 */}
        <Route element={<DefaultLayout />}>
          <Route path="/welcome" element={<WelcomePage />} />
        </Route>

        {/* 네비 x 헤더 x, 취소 버튼 o 뒤로 가기 o  */}
        <Route element={<DefaultLayout noPadding />}>
          <Route path="/compose/topic/:id" element={<ComposePage />} />
          <Route path="/paragraph" element={<ParagraphPage />} />
        </Route>

        {/* 네비 x, 헤더에 취소 버튼 있는 페이지 */}
        <Route
          element={
            <DefaultLayout noPadding header={<Header showBack showClose />} />
          }
        >
          <Route path="/result" element={<ResultPage />} />
        </Route>

        {/* 헤더만 있는 페이지 (네비 패딩 x) */}
        <Route element={<DefaultLayout noPadding header={<Header />} />}>
          <Route path="/compose/topicSelect" element={<TopicSelectPage />} />
          <Route path="/gacha/:id" element={<ProductDetails />} />
        </Route>

        {/* 네비만 있는 페이지 */}
        <Route element={<DefaultLayout noPadding bottomNav={<BottomNav />} />}>
          <Route path="/e-eum" element={<HomePage />} />
        </Route>

        {/* 헤더+네비 있는 그룹 */}
        <Route
          element={
            <DefaultLayout
              header={<Header showBack showClose backTo="/e-eum" />}
              bottomNav={<BottomNav />}
            />
          }
        >
          <Route path="/style" element={<DesignTest />} />
        </Route>

        {/* 헤더 o 네비 o 취소, 패딩 없음 */}
        <Route
          element={
            <DefaultLayout
              noPadding
              header={<Header showBack />}
              bottomNav={<BottomNav />}
            />
          }
        >
          <Route path="/history" element={<HistoryPage />} />
        </Route>
        {/* 헤더 o 네비 o 취소 */}
        <Route
          element={
            <DefaultLayout
              header={<Header showBack />}
              bottomNav={<BottomNav />}
            />
          }
        >
          <Route path="/gacha" element={<GachaPage />} />
        </Route>

        {/* --------------------------------------------------------------- */}

        {/* 기타 404 페이지, 로딩 페이지 */}
        <Route
          element={<DefaultLayout header={<Header showBack showClose />} />}
        >
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/loading" element={<LoadingPage />} />
        </Route>
        {/* 어드민 페이지 */}
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      <ModalProvider />
      <ToastProvider />
    </>
  );
}

export default App;
