import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { resources } from './translations';

declare module 'i18next' {
    interface CustomTypeOptions {
        returnNull: false;
        returnEmptyString: false;
    }
}

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        supportedLngs: ['en', 'es', 'ms', 'zh', 'ta', 'id'],
        ns: ['about',
            'aboutAneurysm',
            'aboutModel',
            'login',
            'patientProfile',
            'patientSignup',
            'dashboard'
        ],
        defaultNS: 'about',
        interpolation: {
            escapeValue: false
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage']
        },
        react: {
            useSuspense: false
        },
        returnNull: false,
        returnEmptyString: false
    });

export default i18n;
