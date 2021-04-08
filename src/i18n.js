import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enUS from './locale/en_US'
import ptBR from './locale/pt_BR'

const resources = {
    'en-US': { translation: enUS },
    'pt-BR': { translation: ptBR }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en-US',
        interpolation: { escapeValue: false }
    });

export default i18n;