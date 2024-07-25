import './normalize.css';
import "./style.css";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import HomePage from './pages/home-page/HomePage';
import InstitutesPage from './pages/institutes-page/InstitutesPage';

function App() {
  return (
    <HelmetProvider>
          <BrowserRouter>
            <Routes>
                <Route path='/' element={<HomePage />}></Route>
                <Route 
                  path='/institute/:intstName'
                  element={<InstitutesPage />} 
                />
                <Route path="*" element={<Navigate to={"/"} />} />
            </Routes>
          </BrowserRouter> 
    </HelmetProvider>
  );
}

export default App;
