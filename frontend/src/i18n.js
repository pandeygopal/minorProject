import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            "Home": "Home",
            "All Jobs": "All Jobs",
            "Login": "Login",
            "Sign Up": "Sign Up",
            "Logout": "Logout",
            "Post New Job": "Post New Job",
            "View Your Jobs": "View Your Jobs",
            "My Applications": "My Applications"
        }
    },
    hi: {
        translation: {
            "Home": "मुख्य पृष्ठ",
            "All Jobs": "सभी नौकरियां",
            "Login": "लॉग इन",
            "Sign Up": "साइन अप",
            "Logout": "लॉग आउट",
            "Post New Job": "नई नौकरी पोस्ट करें",
            "View Your Jobs": "अपनी नौकरियां देखें",
            "My Applications": "मेरे आवेदन"
        }
    },
    gu: {
        translation: {
            "Home": "મુખ્ય પૃષ્ઠ",
            "All Jobs": "બધી નોકરીઓ",
            "Login": "લૉગિન",
            "Sign Up": "સાઇન અપ",
            "Logout": "લૉગઆઉટ",
            "Post New Job": "નવી નોકરી પોસ્ટ કરો",
            "View Your Jobs": "તમારી નોકરીઓ જુઓ",
            "My Applications": "મારી અરજીઓ"
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
