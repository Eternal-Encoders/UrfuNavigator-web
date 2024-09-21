import './normalize.css';
import './style.css';

import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

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
                    <Route path="*" element={<Navigate to={'/'} />} />
                </Routes>
            </BrowserRouter> 
        </HelmetProvider>
    );
}

export default App;
