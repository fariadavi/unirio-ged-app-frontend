import React from 'react'
import { UserProvider } from '../contexts/UserContext';
import { AuthProvider } from '../contexts/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { HashRouter as Router, Route } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import Login from './Login';
import Home from './Home'
import '../style/App.css'

export default function App() {
	return (
		<Router>
			<AuthProvider>
				<UserProvider>
					<GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID}>
						<Route path="/login" component={Login} />
						<PrivateRoute path="*" component={Home} />
					</GoogleOAuthProvider>
				</UserProvider>
			</AuthProvider>
		</Router>
	)
}
