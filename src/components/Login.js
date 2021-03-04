import React, { useContext } from 'react'
import { Container } from 'react-bootstrap'
import GoogleLogin from 'react-google-login'
import rq from '../services/api.js'
import { AuthContext } from '../contexts/AuthContext'

export default function Login() {
    const { setToken } = useContext(AuthContext);

    const handleLoginSuccess = googleData =>
        rq('/api/auth/google/login', {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: googleData.tokenId
        }).then(res => res.ok ? res.text() : handleLoginFail())
        .then(token => token ? setToken(token) : null);

    const handleLoginFail = () => {
        // TODO handle failure show error msg to user
        console.log('login failed');
    }

    return (
        <Container
            className="d-flex align-item justify-content-center"
            style={{ minHeight: "100vh" }}
        >
            <div className="d-flex flex-column align-item justify-content-center">
                <h1>UNIRIO GED App</h1>
                <div className="d-flex align-item justify-content-center">
                    <GoogleLogin
                        clientId={process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID}
                        buttonText="Sign in with Google"
                        onSuccess={handleLoginSuccess}
                        onFailure={handleLoginFail}
                        cookiePolicy={'single_host_origin'}
                    />
                </div>
            </div>
        </Container>
    )
}