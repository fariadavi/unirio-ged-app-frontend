import { getLocalItem, SERVER_TOKEN_KEY } from "../utils/localStorageManager";

export default async function rq(url, options) {
    const token = getLocalItem(SERVER_TOKEN_KEY);
    
    if (token) {
        if (!options.headers)
            options.headers = {}
        options.headers.Authorization = `Bearer ${token}`
    }

    
    return fetch(`${process.env.REACT_APP_SERVER_URL}${url}`, options)
};