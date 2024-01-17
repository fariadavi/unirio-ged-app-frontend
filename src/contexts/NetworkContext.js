import React, { createContext, useCallback, useContext, useLayoutEffect, useState } from 'react'
import { getLocalItem, removeLocalItem, setLocalItem, SERVER_TOKEN_KEY } from "../utils/localStorageManager"
import { NotificationContext } from './NotificationContext';
import { NotificationType } from '../components/notification/Notifications';

const NetworkContext = createContext();

const NetworkProvider = ({ children }) => {
	const [token, setToken] = useState(getLocalItem(SERVER_TOKEN_KEY));

    const { pushNotification } = useContext(NotificationContext);

    const rq = useCallback(async (url, options, internal = true) => {
        const localToken = internal ? token : '';

        if (internal && localToken) {
            if (!options.headers)
                options.headers = {}

            if (!options.headers.Authorization)
                options.headers.Authorization = `Bearer ${localToken}`
        }

        try {
            const res = await fetch(`${internal ? process.env.REACT_APP_SERVER_URL : ''}${url}`, options);
            if (res.status === 403)
                pushNotification(NotificationType.ERROR, 'exception.unauthorized');
            // else if (res.status === 404)
            //     pushNotification(NotificationType.ERROR, 'exception.resourceNotFound');
            
            return res;
        } catch (err) {
            pushNotification(NotificationType.ERROR, 'rq.fail.unexpectedError');
            throw err;
        }
    }, [pushNotification, token]);

    useLayoutEffect(() => {
        if (!token) removeLocalItem(SERVER_TOKEN_KEY);
        else setLocalItem(SERVER_TOKEN_KEY, token);
    }, [token]);

    return <NetworkContext.Provider value={{ rq, token, setToken }}>
        {children}
    </NetworkContext.Provider>
}

export { NetworkContext, NetworkProvider };