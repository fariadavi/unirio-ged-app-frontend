import React, { createContext, useCallback, useContext } from 'react'
import { getLocalItem, SERVER_TOKEN_KEY } from "../utils/localStorageManager"
import { NotificationContext } from './NotificationContext';
import { NotificationType } from '../components/notification/Notifications';

const NetworkContext = createContext();

const NetworkProvider = ({ children }) => {
    const { pushNotification } = useContext(NotificationContext);

    const rq = useCallback(async (url, options, internal = true) => {
        const localToken = internal ? getLocalItem(SERVER_TOKEN_KEY) : '';

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
            else if (res.status === 404)
                pushNotification(NotificationType.ERROR, 'exception.resourceNotFound');
            
            return res;
        } catch (err) {
            pushNotification(NotificationType.ERROR, 'rq.fail.unexpectedError');
            throw err;
        }
    }, [pushNotification]);

    return <NetworkContext.Provider value={{ rq }}>
        {children}
    </NetworkContext.Provider>
}

export { NetworkContext, NetworkProvider };