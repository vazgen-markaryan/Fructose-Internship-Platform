import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    en: {
        translation: {
            "welcome": "https://react.i18next.com/latest/trans-component",
            "sinscrire": "Sign up"

        }
    },
    fr: {
        translation: {
            "welcome": "https://react.i18next.com/latest/trans-component",
            "sinscrire": "S'inscrire"
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: "fr", // Utiliser le français si la langue sélectionné est mal défini ou n'est pas disponible
        lng: "en", // Utiliser le français par défaut

        interpolation: {
            escapeValue: false
        }
    })

export default i18n;