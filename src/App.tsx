import './normalize.css';
import './style.css';

import { lazy, Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './store/hook';
import { selectTheme, setIsTouchEnabled, setScreenSize, setTheme } from './features/rootData/rootDataSlice';
import { Themes } from './utils/interfaces';

const HomePage = lazy(() => import('./pages/home-page/HomePage'));
const InstitutesPage = lazy(() => import('./pages/institutes-page/InstitutesPage'));

function App() {
    const dispatch = useAppDispatch()
    const theme = useAppSelector(selectTheme);

    function setNewSize() {
        dispatch(setScreenSize({
            innerHeight: window.innerHeight,
            innerWidth: window.innerWidth
        }))
    }

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme') as Themes | null;
        if (storedTheme === Themes.dark || storedTheme === Themes.light) {
            dispatch(setTheme(storedTheme));
        }

        window.addEventListener('resize', setNewSize)
        dispatch(setIsTouchEnabled(
            ( 'ontouchstart' in window ) || ( navigator.maxTouchPoints > 0 )
        ))

        return () => {
            window.removeEventListener('resize', setNewSize)
        }
    }, [])

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    return (
        <HelmetProvider>
            <BrowserRouter>
                <Suspense fallback={<div className="container">Loading...</div>}>
                    <Routes>
                        <Route path='/' element={<HomePage />}></Route>
                        <Route 
                            path='/institute/:intstName'
                            element={<InstitutesPage />} 
                        />
                        <Route path="*" element={<Navigate to={'/'} />} />
                    </Routes>
                </Suspense>
            </BrowserRouter> 
        </HelmetProvider>
    );
}

export default App;
