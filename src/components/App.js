import React, { useEffect, useState } from 'react'
import rq from '../services/api';
import { AuthContext } from '../contexts/AuthContext'
import { hasLocalToken, getLocalToken, setLocalToken, removeLocalToken } from '../services/auth'
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import Login from './Login'
import Home from './Home'
import '../style/App.css'

export default function App() {
	const [token, setToken] = useState(getLocalToken());
	const [user, setUser] = useState(null);

	const loginUser = () =>
		rq('/users/loggedUserInfo', { method: "GET" })
			.then(res => { if (res.ok) { return res.json() } else if (res.status === 401) { removeLocalToken() } })
			.then(userData => { if (userData) setUser(userData) });

	const logoutUser = () => setUser(null);

	useEffect(() => {
		let hasToken = hasLocalToken();

		if (token && !hasToken) //logging in
			setLocalToken(token);
		else if (!token && hasToken) //logging out
			removeLocalToken();
	}, [token]);

	useEffect(() => {
		if (token && !user)
			loginUser(); 
		else if (!token && user)
			logoutUser();
	}, [token, user]);

	return (
		<Router>
			<AuthContext.Provider value={{ user, setUser, setToken }}>
				<Route path="/login">
  					{user ? <Redirect to="/" /> : <Login />}
				</Route>
				<PrivateRoute path="*" component={Home} />
			</AuthContext.Provider>
		</Router>
	)
}
