const LANG_KEY = '@user_lang'

export const getUserLanguage = () => localStorage.getItem(LANG_KEY);
export const setUserLanguage = lang => localStorage.setItem(LANG_KEY, lang);