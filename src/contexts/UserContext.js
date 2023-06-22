import React, { createContext, useCallback, useContext, useLayoutEffect, useState } from 'react'
import rq from '../services/api.js'
import { AuthContext } from '../contexts/AuthContext'
import { permissionsByPath } from '../resources/permission-config.js';

const UserContext = createContext();

function UserProvider({ children }) {
    const { token, handleAuthLogout } = useContext(AuthContext);
    const [user, setUser] = useState();
    const [userLoading, setUserLoading] = useState(false);

    const checkPermission = useCallback((...permissions) =>
        (permissions && user?.permissions)
            ? permissions.some(p => user.permissions.includes(p))
            : false, [user]);


    const checkPermissionForPaths = useCallback((...paths) =>
        checkPermission(...paths.flatMap(path => permissionsByPath[path])), [checkPermission]);

    const setLoggedUserInfo = useCallback(async () => {
        setUserLoading(true);

        try {
            const res = await rq('/users/loggedUserInfo', { method: "GET" });

            setUserLoading(false);

            if (!res.ok)
                throw new Error(res.status);

            setUser(await res.json());
        } catch (err) {
            handleAuthLogout();
            throw new Error(err);
        }
    }, [handleAuthLogout])

    const changeDepartment = async deptId => {
        setUserLoading(true);

        const res = await rq(`/users/${user.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ currentDepartment: { id: deptId } })
        });

        setUserLoading(false);

        if (!res.ok)
            throw new Error(res.status);

        setLoggedUserInfo();
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