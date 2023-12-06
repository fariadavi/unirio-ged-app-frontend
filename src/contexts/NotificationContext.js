import React, { createContext, useCallback, useState } from 'react'

const NotificationContext = createContext();

function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);

    const pushNotification = useCallback((type, message, messageParams, header) =>
        setNotifications(nList => [
            ...nList,
            {
                id: crypto.randomUUID(),
                header: header,
                body: { message: message, params: messageParams },
                type: type
            }])
        , []);

    const removeNotification = id =>
        setNotifications(nList => nList.filter(n => n.id !== id));

    const clearAllNotifications = () => setNotifications([]);

    return <NotificationContext.Provider value={{
        notifications,
        pushNotification,
        removeNotification,
        clearAllNotifications
    }}>
        {children}
    </NotificationContext.Provider>
}

export { NotificationContext, NotificationProvider };