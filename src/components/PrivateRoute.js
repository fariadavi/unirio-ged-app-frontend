import React, { useContext } from 'react'
import { Redirect, Route } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext'

export default function PrivateRoute({ component, ...options }) {
    const { user } = useContext(AuthContext);
    console.log(user);
    return (
        <Route {...options} component={user ? component : ''}>
            {user ? '' : <Redirect to="/login" />}
        </Route>
    );
}