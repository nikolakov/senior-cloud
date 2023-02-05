import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

import packageJson from '../package.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    returnNull: false;
  }
}

i18n
  .use(initReactI18next)
  .use(Backend)
  .use(LanguageDetector)
  .init({
    fallbackLng: 'en',
    debug: true,
    returnNull: false,
    interpolation: { escapeValue: false },
    backend: { loadPath: `/locales/{{lng}}/{{ns}}.json?${packageJson.version}` },
  });

export default i18n;
