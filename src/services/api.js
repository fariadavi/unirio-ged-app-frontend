import { getLocalToken } from "./auth";

export default async function rq(url, options) {
    const token = getLocalToken();
    
    if (token) {
        if (!options.headers)
            options.headers = {}
        options.headers.Authorization = `Bearer ${token}`
    }

    return fetch(`${process.env.REACT_APP_SERVER_URL}${url}`, options)
};