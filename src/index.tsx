import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import i18n from './shared/config/i18n/i18n.ts';

import App from './App.tsx';
import store from './store';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        {/* В будущем fallback заменить на loader/skeleton */}
        <Suspense fallback={<div>{i18n.t('Loading')}</div>}>
            <Provider store={store}>
                <App />
            </Provider>
        </Suspense>
    </React.StrictMode>
);
