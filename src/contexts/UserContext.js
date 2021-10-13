import React, { createContext, useContext, useEffect, useState } from 'react';
import rq from '../services/api.js'
import { AuthContext } from '../contexts/AuthContext'

const UserContext = createContext();

function UserProvider({ children }) {
    const { token, handleAuthLogout } = useContext(AuthContext);
    const [user, setUser] = useState();
    const [userLoading, setUserLoading] = useState(false);

    useEffect(() => {
        if (!user && token)
            setLoggedUserInfo();
    }, [user, token]);

    const setLoggedUserInfo = async () => {
        setUserLoading(true);
        
        const res = await rq('/users/loggedUserInfo', { method: "GET" });
        
        if (res.ok)
            setUser(await res.json());

        setUserLoading(false);
    }

    const changeDepartment = async deptId => {
        setUserLoading(true);

        const res = await rq(`/users/${user.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ currentDepartment: { id: deptId } })
        });

        if (res.ok)
            setUser(await res.json());

        setUserLoading(false);
    }

    const logoutUser = () => {
        setUserLoading(true);

        setUser(null);
        handleAuthLogout();
        
        setUserLoading(false);
    }

    return (
        <UserContext.Provider value={{ user, userLoading, setLoggedUserInfo, department: user?.currentDepartment?.id, changeDepartment, logoutUser }}>
            {children}
        </UserContext.Provider>
    );
}

export { UserContext, UserProvider };