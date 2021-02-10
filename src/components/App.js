import React from 'react'
import { Container } from "react-bootstrap"
import GoogleLogin from 'react-google-login'
import { login, logout, isAuthenticated } from '../services/auth.js'
import rq from '../services/api.js'


export default function App() {

	const handleLogin = async googleData => {
		const res = await rq('/api/auth/google/login', {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: googleData.tokenId
		});

		login(await res.text());
	}

	return (
		<Container
			className="d-flex align-item justify-content-center"
			style={{ minHeight: "100vh" }}
		>
			<div className="d-flex flex-column align-item justify-content-center">
				<h1>UNIRIO GED App</h1>
				<div className="d-flex align-item justify-content-center">
					{isAuthenticated()
						? <button onClick={logout}>logout</button>
						: <GoogleLogin
							clientId={process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID}
							buttonText="Sign in with Google"
							onSuccess={handleLogin}
							// onFailure={handleLogin}
							cookiePolicy={'single_host_origin'}
						/>}
				</div>
			</div>
		</Container>
	)
}
