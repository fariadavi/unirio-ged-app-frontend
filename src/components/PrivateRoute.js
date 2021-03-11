import React from 'react'
import { hasLocalToken } from '../services/auth'
import { Redirect, Route } from 'react-router-dom';

export default function PrivateRoute({ component, ...options }) {
    let hasToken = hasLocalToken();
    return (
        <Route {...options} component={hasToken ? component : ''}>
            {hasToken ? '' : <Redirect to="/login" />}
        </Route>
    );
}