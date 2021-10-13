import React, { createContext, useState } from 'react';
import { getLocalToken, setLocalToken, removeLocalToken } from '../services/auth'
import rq from '../services/api.js'

const AuthContext = createContext();

function AuthProvider({ children }) {
    const [token, setToken] = useState(getLocalToken());
    const [authLoading, setAuthLoading] = useState(false);

	const handleAuthLogout = () => {
		setAuthLoading(true);

		setToken(null);
		removeLocalToken();

		setAuthLoading(false);
	}

	const handleAuthenticationFail = () => {
		setAuthLoading(true);

		handleAuthLogout();

		// TODO handle failure show error msg to user 
		console.log('login failed');
		
		setAuthLoading(false);
	}

	const handleAuthentication = async googleData => {
		setAuthLoading(true);
		
		const res = await rq('/api/auth/google/login', {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: googleData.tokenId
		})

		if (res.ok) {
			const localToken = await res.text();
			setLocalToken(localToken);
			setToken(localToken);
		} else {
			handleAuthenticationFail();
		}

		setAuthLoading(false);
	}

	return (
		<AuthContext.Provider value={{ authenticated: token !== null, token, authLoading, handleAuthentication, handleAuthenticationFail, handleAuthLogout }}>
			{children}
		</AuthContext.Provider>
	);
}

export { AuthContext, AuthProvider };