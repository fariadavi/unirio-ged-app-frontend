export const TOKEN_KEY = "@gedapp-auth-token";

export const hasLocalToken = () => localStorage.getItem(TOKEN_KEY) !== null;
export const getLocalToken = () => localStorage.getItem(TOKEN_KEY);
export const setLocalToken = token => localStorage.setItem(TOKEN_KEY, token);
export const removeLocalToken = () => localStorage.removeItem(TOKEN_KEY);