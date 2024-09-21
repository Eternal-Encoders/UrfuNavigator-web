import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(Backend)
    .init({
        supportedLngs: ['ru', 'en'],
        fallbackLng: 'ru',
        debug: import.meta.env.MODE === 'development',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
