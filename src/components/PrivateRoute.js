import React, { useContext } from 'react'
import { Redirect, Route } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext'
import { UserContext } from '../contexts/UserContext'

export default function PrivateRoute({ component, ...options }) {
    const { user, logoutUser } = useContext(UserContext);
    const { token } = useContext(AuthContext);

    if (!token) {
        if (user)
            logoutUser();
        
        return (<Redirect to="/login" />);
    }

    if (!user)
        return <h1>Loading User...</h1>; //TODO replace this with a spinner

    return (<Route {...options} component={component} />);
}