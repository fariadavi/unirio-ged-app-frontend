import React, { useCallback, createContext, useState } from 'react';
import { getLocalItem, setLocalItem, removeLocalItem, SERVER_TOKEN_KEY, GOOGLE_TOKEN_KEY } from '../utils/localStorageManager'
import rq from '../services/api.js'

const AuthContext = createContext();

function AuthProvider({ children }) {
    const [token, setToken] = useState(getLocalItem(SERVER_TOKEN_KEY));
    const [authLoading, setAuthLoading] = useState(false);

	const handleAuthLogout = useCallback(() => {
		setAuthLoading(true);

		setToken(null);
		removeLocalItem(SERVER_TOKEN_KEY);
		removeLocalItem(GOOGLE_TOKEN_KEY);

		setAuthLoading(false);
	}, [])

	const handleAuthentication = async googleData => {
		setAuthLoading(true);
		
		try {
			const res = await rq('/api/auth/google/login', {
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body: googleData.tokenId
			})
	
			if (!res.ok)
				throw new Error(res.status);
			
			const serverToken = await res.text();
			setLocalItem(SERVER_TOKEN_KEY, serverToken);
			setLocalItem(GOOGLE_TOKEN_KEY, googleData.accessToken);
			setToken(serverToken);
		} catch (err) {
			handleAuthLogout();
		}

		setAuthLoading(false);
	}

	return (
		<AuthContext.Provider value={{ authenticated: token !== null, token, authLoading, handleAuthentication, handleAuthLogout }}>
			{children}
		</AuthContext.Provider>
	);
}

export { AuthContext, AuthProvider };