import React, { useContext } from 'react'
import { Link, useRouteMatch } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap'
import { AuthContext } from '../contexts/AuthContext'
import './style/NavBar.css'

export default function NavBar() {
    const { user, setToken } = useContext(AuthContext);

    const handleLogout = () => setToken(null);

    let match = useRouteMatch();

    return (
        <Navbar fixed="top" bg="dark" variant="dark" expand="sm">
            <Navbar.Brand>
                <Link to="/">UNIRIO GED App</Link>
            </Navbar.Brand>
            <Nav className="mr-auto">
                <Link to="/categories" className="nav-link">Categories</Link>
                <Link to="/users" className="nav-link">Users</Link>
            </Nav>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                    <Navbar.Text>
                        {user ? `Hello ${user.firstName}!` : ''}
                    </Navbar.Text>
                </Nav>
                <Nav.Link onClick={handleLogout}>logout-icon</Nav.Link>
            </Navbar.Collapse>
        </Navbar>
    )
}
