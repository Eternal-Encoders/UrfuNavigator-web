import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GlobalState } from './contextes/GlobalContext';
import { RouteState } from './contextes/RouteContext';
import { MapState } from "./contextes/MapContext";
import "./style.css";
import './normalize.css'

import HomePage from './pages/home-page/HomePage';
import InstitutesPage from './pages/institutes-page/InstitutesPage';
import { HelmetProvider } from "react-helmet-async";

function App() {
  return (
    <HelmetProvider>
      <GlobalState>
        <MapState>
            <RouteState>
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
            </RouteState>
          </MapState>
      </GlobalState>  
    </HelmetProvider>
  );
}

export default App;
