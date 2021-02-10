import { getToken } from "./auth";

export default function rq(url, options) {
    const token = getToken();
    
    if (token)
        options.headers.Authorization = `Bearer ${token}`

    return fetch(`${process.env.REACT_APP_SERVER_URL}${url}`, options)
};