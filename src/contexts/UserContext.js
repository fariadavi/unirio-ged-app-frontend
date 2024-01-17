import React, { createContext, useCallback, useContext, useLayoutEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { NotificationContext } from './NotificationContext.js'
import { NetworkContext } from '../contexts/NetworkContext'
import { NotificationType } from '../components/notification/Notifications.js'
import { reqPermByPath } from '../resources/permission-config.js'

const UserContext = createContext();

function UserProvider({ children }) {
    const { pushNotification } = useContext(NotificationContext);
    const { rq, token } = useContext(NetworkContext);
    const { handleAuthLogout } = useContext(AuthContext);
    const [user, setUser] = useState();
    const [userLoading, setUserLoading] = useState(false);

    const checkPermission = useCallback((...permissions) =>
        (permissions && user?.permissions)
            ? permissions.some(p => user.permissions.includes(p))
            : false, [user]);


    const checkPermissionForPaths = useCallback((...paths) =>
        !paths.length || paths.some(path => !reqPermByPath[path]) ||
        checkPermission(...paths.flatMap(path => reqPermByPath[path])), [checkPermission]);

    const setLoggedUserInfo = useCallback(async () => {
        setUserLoading(true);

        try {
            const res = await rq('/users/loggedUserInfo', { method: "GET" });

            if (!res.ok) {
                pushNotification(NotificationType.ERROR, 'user.loggedUserInfo.fail');
                throw new Error(res.status);
            }

            setUser(await res.json());
        } catch (err) {
            handleAuthLogout();
        } finally {
            setUserLoading(false);
        }
    }, [rq, pushNotification, handleAuthLogout])

    const changeDepartment = async deptId => {
        setUserLoading(true);

        try {
            const res = await rq(`/users/${user.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentDepartment: { id: deptId } })
            });

            if (!res.ok) {
                pushNotification(NotificationType.ERROR, 'user.changeDepartment.fail');
                throw new Error(res.status);
            }

            setLoggedUserInfo();
        } catch (err) {
            logoutUser();
        } finally {
            setUserLoading(false);
        }
    }

    const logoutUser = () => {
        setUserLoading(true);

        setUser(null);
        handleAuthLogout();

        setUserLoading(false);
    }

    useLayoutEffect(() => {
        if (!user && token)
            setLoggedUserInfo();
    }, [user, token, setLoggedUserInfo]);

    return (
        <UserContext.Provider value={{ user, department: user?.currentDepartment, userLoading, checkPermission, checkPermissionForPaths, setLoggedUserInfo, changeDepartment, logoutUser }}>
            {children}
        </UserContext.Provider>
    );
}

export { UserContext, UserProvider };