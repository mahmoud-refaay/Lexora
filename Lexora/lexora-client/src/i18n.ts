import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import commonAr from './locales/ar/common.json';
import authAr from './locales/ar/auth.json';
import usersAr from './locales/ar/users.json';
import clientsAr from './locales/ar/clients.json';
import casesAr from './locales/ar/cases.json';

import commonEn from './locales/en/common.json';
import authEn from './locales/en/auth.json';
import usersEn from './locales/en/users.json';
import clientsEn from './locales/en/clients.json';
import casesEn from './locales/en/cases.json';

const resources = {
  ar: {
    common: commonAr,
    auth: authAr,
    users: usersAr,
    clients: clientsAr,
    cases: casesAr
  },
  en: {
    common: commonEn,
    auth: authEn,
    users: usersEn,
    clients: clientsEn,
    cases: casesEn
  }
};

const savedLanguage = localStorage.getItem('lexora_lang') || 'ar';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'ar',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false
    }
  });

document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
document.documentElement.lang = savedLanguage;

i18n.on('languageChanged', (lng) => {
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
  localStorage.setItem('lexora_lang', lng);
});

export default i18n;
