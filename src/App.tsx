import './App.css';
import DefaultLayout from '@_layout/DefaultLayout';
import DesignTest from '@_page/DesignTest';
import { Routes, Route } from 'react-router-dom';
import Header from '@_layout/Header';
import BottomNav from '@_components/layout/BottomNav';
import WelcomePage from '@_page/WelcomePage';
import HomePage from '@_page/HomePage';
import TopicSelectPage from '@_page/TopicSelectPage';

function App() {
  return (
    <Routes>
      {/* 헤더+네비 있는 그룹 */}
      <Route
        element={
          <DefaultLayout
            header={<Header showBack backTo="/e-eum" />}
            bottomNav={<BottomNav />}
          />
        }
      >
        <Route path="/style" element={<DesignTest />} />
      </Route>

      {/* 네비만 없는 페이지 */}
      <Route element={<DefaultLayout noPadding header={<Header />} />}>
        <Route path="/compose/topicSelect" element={<TopicSelectPage />} />
      </Route>

      {/* 헤더/네비 없는 페이지 */}
      <Route element={<DefaultLayout />}>
        <Route path="/welcome" element={<WelcomePage />} />
      </Route>

      <Route element={<DefaultLayout noPadding bottomNav={<BottomNav />} />}>
        <Route path="/e-eum" element={<HomePage />} />
      </Route>

      {/* 기타 404 페이지 */}
      <Route element={<DefaultLayout />}>
        <Route path="*" element={<div>/welcome 주소로 이동해 주세요</div>} />
      </Route>
    </Routes>
  );
}

export default App;
