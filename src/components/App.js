import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute'
import Login from './Login'
import Home from './Home'
import { AuthContext } from '../contexts/AuthContext'
import { hasLocalToken, getLocalToken, setLocalToken, removeLocalToken } from '../services/auth.js'
import rq from '../services/api';

export default function App() {
	const [token, setToken] = useState(getLocalToken());
	const [user, setUser] = useState(null);

	const loginUser = () =>
		rq('/users/loggedUserInfo', { method: "GET" })
			.then(res => { if (res.ok) return res.json() })
			.then(userData => setUser(userData));

	const logoutUser = () => setUser(null);

	useEffect(() => {
		console.log('token')
		let hasToken = hasLocalToken();

		if (token && !hasToken) //logging in
			setLocalToken(token);
		else if (!token && hasToken) //logging out
			removeLocalToken();
	}, [token]);

	useEffect(() => {
		console.log(`hasToken: ${hasLocalToken()} \ntoken: ${token} \nuser: ${JSON.stringify(user)}`)

		if (token && !user)
			loginUser();
		else if (!token && user)
			logoutUser();
	}, [token, user]);

	return (
		<Router>
			<AuthContext.Provider value={{ user, setToken }}>
				<Route path="/login">
  					{user ? <Redirect to="/" /> : <Login />}
				</Route>
				<PrivateRoute exact path="/" component={Home} />
				<PrivateRoute path="/users" component={Home} />
				<PrivateRoute path="/categories" component={Home} />
				<PrivateRoute path="*" component={Home} />
			</AuthContext.Provider>
		</Router>
	)
}
