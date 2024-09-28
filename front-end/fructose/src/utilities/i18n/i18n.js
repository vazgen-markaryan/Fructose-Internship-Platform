import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import english from "./locals/en.json";
import francais from "./locals/fr.json";

const resources = {
    en: {
        translation: english,
    },
    fr: {
        translation: francais,
    },
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: "fr", // Utiliser le français si la langue sélectionné est mal défini ou n'est pas disponible
        //TODO: CHANGER EN FR APRÈS AVOIR FINI DE TRADUIRE
        lng: "en", // Utiliser le français par défaut

        interpolation: {
            escapeValue: false
        }
    })