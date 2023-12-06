import React, { createContext, useState } from 'react'

const NotificationContext = createContext();

function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);

    const pushNotification = (message, header) =>
        setNotifications(nList => [...nList, { id: crypto.randomUUID(), header: header, body: message }]);

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