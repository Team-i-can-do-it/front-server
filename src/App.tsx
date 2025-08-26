import './App.css';
import DefaultLayout from '@_components/layout/DefaultLayout';
import DesignTest from '@_page/DesignTest';
import { Routes } from 'react-router-dom';
import { Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route element={<DefaultLayout />}>
        <Route path="/style" element={<DesignTest />} />
      </Route>
    </Routes>
  );
}

export default App;
