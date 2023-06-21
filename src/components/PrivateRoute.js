import React, { useContext, useLayoutEffect } from 'react'
import { Redirect, Route } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext'
import { UserContext } from '../contexts/UserContext'

export default function PrivateRoute({ component, ...options }) {
    const { user, logoutUser } = useContext(UserContext);
    const { token } = useContext(AuthContext);

    useLayoutEffect(() => {
        if (!token && user)
            logoutUser();
    }, [token, user, logoutUser]);

    return (
        token && user
            ? <Route {...options} component={component} />
            : !token
                ? <Redirect to="/login" />
                : <h1>Loading User...</h1>
    );
}