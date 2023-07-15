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

export enum LanguageCode {
  bg = 'bg',
  en = 'en',
}

export type SupportedLanguageType = {
  code: LanguageCode;
  name: string;
};

const supportedLanguages = [
  {
    code: LanguageCode.bg,
    name: 'Български',
  },
  {
    code: LanguageCode.en,
    name: 'English',
  },
];

const fallbackLanguageCode = LanguageCode.bg;

class I18nHelper {
  supportedLanguages: SupportedLanguageType[];
  fallbackLanguageCode: LanguageCode;

  constructor(supportedLanguages: SupportedLanguageType[], fallbackLanguageCode: LanguageCode) {
    this.supportedLanguages = supportedLanguages;
    this.fallbackLanguageCode = fallbackLanguageCode;
    (i18n as any).helper = this;
  }

  init() {
    i18n
      .use(initReactI18next)
      .use(Backend)
      .use(LanguageDetector)
      .init({
        fallbackLng: this.fallbackLanguageCode,
        debug: process.env.NODE_ENV === 'production' ? false : true,
        returnNull: false,
        interpolation: { escapeValue: false },
        backend: { loadPath: `/locales/{{lng}}/{{ns}}.json?${packageJson.version}` },
      });
  }

  getActualLanguage() {
    const languageCode = this.getLanguageCodeFromLocale(i18n.languages[0]);
    const language = this.findLanguageInSupported(languageCode);
    if (language) return language;

    return this.fallbackLanguage;
  }

  findLanguageInSupported(languageCode: string) {
    return this.supportedLanguages.find(l => l.code === languageCode);
  }

  get fallbackLanguage() {
    return this.supportedLanguages.find(
      l => l.code === this.fallbackLanguageCode
    ) as SupportedLanguageType;
  }

  get i18n() {
    return i18n;
  }

  private getLanguageCodeFromLocale(language: string) {
    return language.split('-')[0];
  }
}

const i18nHelper = new I18nHelper(supportedLanguages, fallbackLanguageCode);
i18nHelper.init();

export default i18nHelper;
