import React, { useContext } from 'react'
import rq from '../services/api'
import { AuthContext } from '../contexts/AuthContext'
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExchangeAlt, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import '../style/NavBar.css'

export default function NavBar() {
    const { user, setUser, setToken } = useContext(AuthContext);

    const handleLogout = () => setToken(null);

    const handleSwitchDepartment = deptId => {
        if (deptId !== user?.currentDepartment?.id) {
            rq(`/users/${user.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentDepartment: { id: deptId } })
            }).then(res => { if (res.ok) return res.json() 
            }).then(newUser => { if (newUser) { setUser(newUser); window.location.reload(); } });
        }
    };

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
                    <Link to="/departments" className="dropdown-item">Departments</Link>
                    <Link to="/users" className="dropdown-item">Invite New Users</Link>
                    <Link to="/permissions" className="dropdown-item">User Permissions</Link>
                </NavDropdown>
            </Nav>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                    <div className="nav-link menu-user-box">
                        <span>{`${user?.firstName} ${user?.surname}`}</span>
                        <FontAwesomeIcon icon={faUser} />
                    </div>
                </Nav>
                <Nav>
                    <NavDropdown title={
                        <>
                            <span>{`Department: ${user?.currentDepartment?.acronym}`}</span>
                            <FontAwesomeIcon icon={faExchangeAlt} />
                        </>
                    }>
                        { (user ? user.departments : []).map(dept =>
                            <NavDropdown.Item key={dept.id} onClick={() => { handleSwitchDepartment(dept.id) }} className={`${dept.id === user?.currentDepartment?.id ? 'active' : '' }`}>
                                {`${dept.name} (${dept.acronym})`}
                            </NavDropdown.Item>
                        )}
                    </NavDropdown>
                </Nav>
                <Nav>
                    <Nav.Link onClick={handleLogout}>
                        <span>Logout</span>
                        <FontAwesomeIcon icon={faSignOutAlt} />
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}
