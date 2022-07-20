import React, { createContext, useContext, useEffect, useState } from 'react'
import { UserContext } from './UserContext'
import rq from '../services/api.js'

const UserManagementContext = createContext();

const UserManagementProvider = ({ children }) => {
    const { department } = useContext(UserContext);
    const [users, setUsers] = useState([]);

    const loadUsers = async () => {
        const res = await rq('/users', { method: 'GET' });

        if (!res.ok)
            throw Error();

        setUsers(await res.json());
    }

    useEffect(() => loadUsers(), [department]);

    const addNewUser = async email => {
        const res = await rq('/users/invite', {
            method: 'POST',
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `email=${email}`
        })
    
        if (!res.ok)
            throw Error(res.statusText);
    
        const newUser = await res.json();
        
        setUsers([ ...users, newUser ]);
    }

    const removeUser = async userId => {
        const res = await rq(`/users/${userId}`, { method: 'DELETE' })
    
        if (!res.ok)
            throw Error(res.statusText);
        
        setUsers([ ...users.filter(u => u.id !== userId) ]);
    }

    return (
        <UserManagementContext.Provider value={{ users, addNewUser, loadUsers, removeUser }}>
            {children}
        </UserManagementContext.Provider>
    );
}

export { UserManagementContext, UserManagementProvider };