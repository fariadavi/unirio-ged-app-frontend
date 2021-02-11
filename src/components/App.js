import React, { useState } from 'react'
import { Container } from "react-bootstrap"
import { UserContext } from '../contexts/UserContext'
import Login from './Login'

export default function App() {
	const [user, setUser] = useState(null)

	return (
		<UserContext.Provider value={{ user, setUser }}>
			<Container
				className="d-flex align-item justify-content-center"
				style={{ minHeight: "100vh" }}
			>
				<Login />
			</Container>
		</UserContext.Provider>
	)
}
