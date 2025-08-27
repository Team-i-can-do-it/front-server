import './App.css';
import DefaultLayout from '@_layout/DefaultLayout';
import DesignTest from '@_page/DesignTest';
import { Routes, Route } from 'react-router-dom';
import Header from '@_layout/Header';
import BottomNav from '@_components/layout/BottomNav';
import WelcomePage from '@_page/WelcomePage';

function App() {
  return (
    <Routes>
      <Route
        element={
          <DefaultLayout
            header={
              <Header
                title="스타일 테스트"
                showBack
                backTo="/"
                showClose={true}
              />
            }
            bottomNav={<BottomNav />}
          />
        }
      >
        <Route path="/style" element={<DesignTest />} />
      </Route>

      <Route path="/welcome" element={<WelcomePage />} />
    </Routes>
  );
}

export default App;
