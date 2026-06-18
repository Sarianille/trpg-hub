import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '@/locales/en.json'
import cs from '@/locales/cs.json'
import sk from '@/locales/sk.json'

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    cs: { translation: cs },
    sk: { translation: sk },
  },
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  pluralSeparator: '_',
})

export default i18n