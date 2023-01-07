export const SERVER_TOKEN_KEY = "@gedapp-auth-token";
export const LANG_KEY = '@user_lang'

export const hasLocalItem = itemKey => localStorage.getItem(itemKey) !== null;
export const getLocalItem = itemKey => localStorage.getItem(itemKey);
export const setLocalItem = (itemKey, value) => localStorage.setItem(itemKey, value);
export const removeLocalItem = itemKey => localStorage.removeItem(itemKey);