import React, { createContext, useCallback, useContext, useLayoutEffect, useRef, useState } from 'react'
import { SERVER_TOKEN_KEY, getLocalItem, setLocalItem, removeLocalItem } from '../utils/localStorageManager'
import { NotificationContext } from './NotificationContext'
import { NetworkContext } from './NetworkContext'
import { NotificationType } from '../components/notification/Notifications'
import { getTokenDetails } from '../utils/jwtHelper'
import { useLocation } from 'react-router-dom'

const AuthContext = createContext();

function AuthProvider({ children }) {
	const { pushNotification } = useContext(NotificationContext);
	const { rq } = useContext(NetworkContext);
	const [token, setToken] = useState(getLocalItem(SERVER_TOKEN_KEY));
	const [authLoading, setAuthLoading] = useState(false);
	const location = useLocation();
	const timeoutId = useRef(null);

	const handleAuthLogout = useCallback(() => {
		setAuthLoading(true);

		removeLocalItem(SERVER_TOKEN_KEY);
		setToken(null);
		clearTimeout(timeoutId.current);
		timeoutId.current = null;

		setAuthLoading(false);
	}, []);

	const handleAuthentication = async credentialResponse => {
		setAuthLoading(true);

		try {
			const res = await rq('/api/auth/google/login', {
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body: credentialResponse.credential
			})

			if (!res.ok) {
				pushNotification(NotificationType.ERROR,
					res.status === 404
						? 'login.fail.userNotFound'
						: 'login.fail.unknownError'
				);

				throw new Error();
			}

			const serverToken = await res.text();
			if (!serverToken) throw new Error();
			setLocalItem(SERVER_TOKEN_KEY, serverToken);
			setToken(serverToken);
			setAutoLogoutTimer(serverToken);
		} catch (err) {
			handleAuthLogout();
		} finally {
			setAuthLoading(false);

		}
	}

	const setAutoLogoutTimer = useCallback(token => {
		if (!token) return;
		const { msUntilTokenExp } = getTokenDetails(token);

		if (timeoutId.current)
			clearTimeout(timeoutId.current);
		timeoutId.current = setTimeout(() => handleAuthLogout(), msUntilTokenExp - 1000);
	}, [handleAuthLogout]);

	useLayoutEffect(() => {
		const refreshAuthentication = async () => {
			try {
				const res = await rq('/api/auth/refresh', { method: "GET" });

				if (!res.ok)
					throw new Error(res.status);

				const serverToken = await res.text();
				if (!serverToken) throw new Error();
				setLocalItem(SERVER_TOKEN_KEY, serverToken);
				setToken(serverToken);
				setAutoLogoutTimer(serverToken);
			} catch (err) {
				console.log('Unable to refresh token. User will be logged out at the end of the session.');
			}
		}

		let { isTokenExpired, isTokenAboutToExpire } = getTokenDetails(token);
		if (isTokenAboutToExpire) {
			if (!isTokenExpired)
				refreshAuthentication();
			else
				handleAuthLogout();
		}
	}, [rq, location, token, handleAuthLogout, setAutoLogoutTimer]);

	return (
		<AuthContext.Provider value={{ authenticated: token !== null, token, authLoading, handleAuthentication, handleAuthLogout }}>
			{children}
		</AuthContext.Provider>
	);
}

export { AuthContext, AuthProvider };