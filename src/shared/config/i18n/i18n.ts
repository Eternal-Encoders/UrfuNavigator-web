import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

export const i18nReady = i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(Backend)
    .init({
        supportedLngs: ['ru', 'en', 'zh', 'ar'],
        fallbackLng: 'ru',
        load: 'languageOnly',
        detection: {
            order: ['localStorage', 'navigator'],
            lookupLocalStorage: 'urfuNavigator.language',
            caches: []
        },
        backend: { loadPath: '/locales/{{lng}}/translation.json' },
        debug: import.meta.env.MODE === 'development',
        interpolation: {
            escapeValue: false,
        },
    });

i18n.on('languageChanged', language => {
    document.documentElement.lang = language.split('-')[0];
});

export default i18n;
