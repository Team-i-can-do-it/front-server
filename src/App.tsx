import './App.css';
import DefaultLayout from '@_layout/DefaultLayout';
import DesignTest from '@_page/DesignTest';
import { Routes, Route } from 'react-router-dom';
import Header from '@_layout/Header';
import BottomNav from '@_components/layout/BottomNav';
import WelcomePage from '@_page/WelcomePage';
import HomePage from '@_page/HomePage';

function App() {
  return (
    <Routes>
      {/* 헤더+네비 있는 그룹 */}
      <Route
        element={
          <DefaultLayout
            header={
              <Header title="스타일 테스트" showBack backTo="/" showClose />
            }
            bottomNav={<BottomNav />}
          />
        }
      >
        <Route path="/style" element={<DesignTest />} />
      </Route>

      {/* 헤더/네비 없는 페이지 */}
      <Route element={<DefaultLayout />}>
        <Route path="/welcome" element={<WelcomePage />} />
      </Route>
      <Route element={<DefaultLayout noPadding bottomNav={<BottomNav />} />}>
        <Route path="/e-eum" element={<HomePage />} />
      </Route>
    </Routes>
  );
}

export default App;
