import React, { useContext } from 'react'
import GoogleLogin from 'react-google-login'
import { setToken, removeToken, isAuthenticated } from '../services/auth.js'
import rq from '../services/api.js'
import { UserContext } from '../contexts/UserContext.js'

export default function Login() {
    const { user, setUser } = useContext(UserContext)

    const handleLogin = async googleData => {
        const res = await rq('/api/auth/google/login', {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: googleData.tokenId
        });

        setToken(await res.text());

        setUser({
            "id": 4,
            "firstName": "Davi",
            "surname": "Faria",
            "email": "davifaria@edu.unirio.br",
            "permissions": null,
            "department": {
                "id": 1,
                "name": "TESTE2",
                "acronym": "DIA"
            }
        });
    }

    const handleLogout = () => {
        removeToken();

        setUser(null);
    }

    return (
        <div className="d-flex flex-column align-item justify-content-center">
            <h1>UNIRIO GED App</h1>
            <div className="d-flex align-item justify-content-center">
                {isAuthenticated()
                    ? <button onClick={handleLogout}>logout</button>
                    : <GoogleLogin
                        clientId={process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID}
                        buttonText="Sign in with Google"
                        onSuccess={handleLogin}
                        // onFailure={handleLogin}
                        cookiePolicy={'single_host_origin'}
                    />}
            </div>
        </div>
    )
}