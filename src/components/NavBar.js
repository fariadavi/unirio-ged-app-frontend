import React, { useContext, useEffect, useState } from 'react'
import rq from '../services/api'
import { getUserLanguage, setUserLanguage } from '../services/lang'
import { AuthContext } from '../contexts/AuthContext'
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCogs, faExchangeAlt, faFileAlt, faHouseUser, faKey, faLanguage, faPlusCircle, faSearch, faStream, faUser, faUserPlus, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import '../style/NavBar.css'

export default function NavBar() {
    const { user, setUser, setToken } = useContext(AuthContext);
    const [ language, setLanguage ] = useState(getUserLanguage());
    const languageList = [
        { name: 'English', code: 'en-US', imageUrl: 'http://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg' , altText: 'English - United States' },
        { name: 'Portuguese', code: 'pt-BR', imageUrl: 'http://purecatamphetamine.github.io/country-flag-icons/3x2/BR.svg' , altText: 'Brazilian Portuguese' }
    ]

    useEffect(() => setUserLanguage(language || navigator.language || navigator.userLanguage), [language])

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

    const handleSwitchLanguage = lang => { if (lang !== language) setLanguage(lang) };

    return (
        <Navbar fixed="top" bg="dark" variant="dark" expand="sm">
            <Navbar.Brand>
                <Link to="/">UNIRIO GED App</Link>
            </Navbar.Brand>
            <Nav className="mr-auto">
                <NavDropdown title={
                    <>
                        <FontAwesomeIcon icon={faFileAlt} />
                        <span>Document</span>
                    </>
                }>
                    <Link to="/documents/" className="dropdown-item">
                        <FontAwesomeIcon className="icon" icon={faPlusCircle} />
                        Add New Document
                    </Link>
                    <Link to="/" className="dropdown-item">
                        <FontAwesomeIcon className="icon" icon={faSearch} />
                        Search Documents
                    </Link>
                </NavDropdown>
                <NavDropdown title={
                    <>
                        <FontAwesomeIcon icon={faCogs} />
                        <span>Management</span>
                    </>
                }>
                    <Link to="/categories" className="dropdown-item">
                        <FontAwesomeIcon className="icon" icon={faStream} />
                        Categories
                    </Link>
                    <Link to="/departments" className="dropdown-item">
                        <FontAwesomeIcon className="icon" icon={faHouseUser} />                        
                        Departments
                    </Link>
                    <Link to="/users" className="dropdown-item">
                        <FontAwesomeIcon className="icon" icon={faUserPlus} />
                        Invite New Users
                    </Link>
                    <Link to="/permissions" className="dropdown-item">
                        <FontAwesomeIcon className="icon" icon={faKey} />
                        User Permissions
                    </Link>
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
                            <span>Language</span>
                            <FontAwesomeIcon icon={faLanguage} />
                        </>
                     }>
                        { languageList.map((lang, index) =>
                            <NavDropdown.Item key={index} onClick={() => { handleSwitchLanguage(lang.code) }} className={`${language === lang.code ? 'active' : '' }`}>
                                <img className="icon flag" alt={lang.altText} src={lang.imageUrl}/>
                                <span>{lang.name}</span>
                            </NavDropdown.Item>
                        )}
                    </NavDropdown>
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
