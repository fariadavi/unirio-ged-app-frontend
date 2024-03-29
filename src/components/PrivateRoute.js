import React, { useContext, useLayoutEffect, useState } from 'react'
import { Redirect, Route, useLocation } from 'react-router-dom'
import { UserContext } from '../contexts/UserContext'
import GlobalSpinner from './util/GlobalSpinner';
import { NetworkContext } from '../contexts/NetworkContext';

export default function PrivateRoute({ component, ...options }) {
    const { user, logoutUser, checkPermissionForPaths } = useContext(UserContext);
    const { token } = useContext(NetworkContext);
    const [redirect, setRedirect] = useState(null);
    const location = useLocation();

    useLayoutEffect(() => {
        if (!token && user)
            logoutUser();
    }, [token, user, logoutUser]);

    useLayoutEffect(() => {
        if (!user || !location || location.pathname === '/') {
            setRedirect(null);
            return;
        }

        let path = location.pathname;
        if (path.length > 1 && path.at(-1) === '/') path = path.slice(0, -1);
        if (!checkPermissionForPaths(path))
            setRedirect("/");
    }, [location, checkPermissionForPaths, user]);

    return (
        token && user
            ? redirect
                ? <Redirect to={redirect} />
                : <Route {...options} component={component} />
            : !token
                ? <Redirect to="/login" />
                : <GlobalSpinner />
    );
}