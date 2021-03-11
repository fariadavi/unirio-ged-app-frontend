import React, { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import '../style/NavBar.css'

export default function NavBar() {
    const { user, setToken } = useContext(AuthContext);

    const handleLogout = () => setToken(null);

    return (
        <Navbar fixed="top" bg="dark" variant="dark" expand="sm">
            <Navbar.Brand>
                <Link to="/">UNIRIO GED App</Link>
            </Navbar.Brand>
            <Nav className="mr-auto">
                <Link to="/documents/" className="nav-link">Add Document</Link>
                <Link to="/" className="nav-link">Search Documents</Link>
                <NavDropdown title="Management" id="collasible-nav-dropdown">
                    <Link to="/categories" className="dropdown-item">Categories</Link>
                    <Link to="/users" className="dropdown-item">Users</Link>
                </NavDropdown>
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
