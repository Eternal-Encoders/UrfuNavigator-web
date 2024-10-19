import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './App.tsx';
import './shared/config/i18n/i18n.ts';
import store from './store';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        {/* В будущем fallback заменить на loader/skeleton */}
        <Suspense fallback="">
            <Provider store={store}>
                <App />
            </Provider>
        </Suspense>
    </React.StrictMode>
);
