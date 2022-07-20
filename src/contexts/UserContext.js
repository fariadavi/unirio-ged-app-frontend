import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import rq from '../services/api.js'
import { AuthContext } from '../contexts/AuthContext'

const UserContext = createContext();

function UserProvider({ children }) {
    const { token, handleAuthLogout } = useContext(AuthContext);
    const [user, setUser] = useState();
    const [userLoading, setUserLoading] = useState(false);

    const checkPermission = (...permissions) => permissions.some(p => user.permissions.includes(p));

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

    useEffect(() => {
        if (!user && token)
            setLoggedUserInfo();
        // eslint-disable-next-line
    }, [user, token]);

    return (
        <UserContext.Provider value={{ user, department: user?.currentDepartment, userLoading, checkPermission, setLoggedUserInfo, changeDepartment, logoutUser }}>
            {children}
        </UserContext.Provider>
    );
}

export { UserContext, UserProvider };