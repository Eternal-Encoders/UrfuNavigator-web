import './normalize.css';
import './style.css';

import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import HomePage from './pages/home-page/HomePage';
import InstitutesPage from './pages/institutes-page/InstitutesPage';
import { useEffect } from 'react';
import { useAppDispatch } from './store/hook';
import { setIsTouchEnabled, setScreenSize } from './features/rootData/rootDataSlice';

function App() {
    const dispatch = useAppDispatch()

    function setNewSize() {
        dispatch(setScreenSize({
            innerHeight: window.innerHeight,
            innerWidth: window.innerWidth
        }))
    }

    useEffect(() => {
        window.addEventListener('resize', setNewSize)
        dispatch(setIsTouchEnabled(
            ( 'ontouchstart' in window ) || ( navigator.maxTouchPoints > 0 )
        ))

        return () => {
            window.removeEventListener('resize', setNewSize)
        }
    })

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
