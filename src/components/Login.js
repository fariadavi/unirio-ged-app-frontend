import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import GoogleLogin from 'react-google-login'
import { Container } from 'react-bootstrap'
import { AuthContext } from '../contexts/AuthContext'
import { Redirect } from 'react-router-dom'

export default function Login() {
    const { t } = useTranslation();
    const { authLoading, authenticated, handleAuthentication, handleAuthLogout } = useContext(AuthContext);    

	const handleAuthenticationFail = (err, details) => {
		handleAuthLogout();

		// TODO handle failure show error msg to user 
		console.log('login failed');
	}

    if (authLoading)
        return <h1>Loading...</h1>; //TODO replace this with a spinner

    if (authenticated)
        return (<Redirect to="/" />)

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
                        buttonText={t('loginWithGoogle.buttonText')}
                        onSuccess={handleAuthentication}
                        onFailure={handleAuthenticationFail}
                        cookiePolicy={'single_host_origin'}
                    />
                </div>
            </div>
        </Container>
    )
}