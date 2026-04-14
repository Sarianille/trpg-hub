import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: {
      "logout": "Sign Out",
      login: {
        title: "Login",
        description: "Enter your email below to login to your account",
        email: "Email",
        emailPlaceholder: "m@example.com",
        password: "Password",
        forgotPassword: "Forgot your password?",
        submit: "Login",
        submitting: "Logging in...",
        noAccount: "Don't have an account?",
        signUp: "Sign up",
        error: "An error occured",
      }
    }},
    cs : { translation: {
      "logout": "Odhlásit se",
      login: {
        title: "Přihlášení",
        description: "Zadejte svůj email pro přihlášení",
        email: "Email",
        emailPlaceholder: "m@priklad.cz",
        password: "Heslo",
        forgotPassword: "Zapomněli jste heslo?",
        submit: "Přihlásit se",
        submitting: "Přihlašování...",
        noAccount: "Nemáte účet?",
        signUp: "Zaregistrovat se",
        error: "Došlo k chybě",
      }
    }},
    sk : { translation: {
      "logout": "Odhlásiť sa",
      login: {
        title: "Prihlásenie",
        description: "Zadajte svoj email pre prihlásenie",
        email: "Email",
        emailPlaceholder: "m@priklad.sk",
        password: "Heslo",
        forgotPassword: "Zabudli ste heslo?",
        submit: "Prihlásiť sa",
        submitting: "Prihlasovanie...",
        noAccount: "Nemáte účet?",
        signUp: "Zaregistrovať sa",
        error: "Nastala chyba",
      }
    }}
  },
  lng: 'cs',
  fallbackLng: 'en',
})

export default i18n