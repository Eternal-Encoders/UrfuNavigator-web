import { StrictMode, Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { i18n } from '@/shared/config';
import { useAppEnvironment } from '../model/useAppEnvironment';
import { AppRouter } from '../router/AppRouter';
import { store } from '../store';

function AppShell() {
    useAppEnvironment();

    return (
        <HelmetProvider>
            <AppRouter />
        </HelmetProvider>
    );
}

export function App() {
    return (
        <StrictMode>
            <Suspense fallback={<div>{i18n.t('Loading')}</div>}>
                <Provider store={store}>
                    <AppShell />
                </Provider>
            </Suspense>
        </StrictMode>
    );
}
