import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./style.css";
import './normalize.css'

import HomePage from './pages/home-page/HomePage';
import InstitutesPage from './pages/institutes-page/InstitutesPage';
import { HelmetProvider } from "react-helmet-async";

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
