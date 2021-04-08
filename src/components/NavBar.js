import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AuthContext } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import rq from '../services/api'
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'
import { getUserLanguage, setUserLanguage } from '../services/lang'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCogs, faExchangeAlt, faFileAlt, faHouseUser, faKey, faLanguage, faPlusCircle, faSearch, faStream, faUser, faUserPlus, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import '../style/NavBar.css'

export default function NavBar() {
    const { t, i18n } = useTranslation();
    const { user, setUser, setToken } = useContext(AuthContext);
    const [ language, setLanguage ] = useState(getUserLanguage());
    const languageList = [
        { code: 'en-US', imageUrl: 'http://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg' },
        { code: 'pt-BR', imageUrl: 'http://purecatamphetamine.github.io/country-flag-icons/3x2/BR.svg' }
    ]

    useEffect(() => {
        i18n.changeLanguage(language)
        setUserLanguage(language || navigator.language || navigator.userLanguage)
    }, [i18n, language])

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

    const handleSwitchLanguage = langCode => { if (langCode !== language) setLanguage(langCode) };

    return (
        <Navbar fixed="top" bg="dark" variant="dark" expand="sm">
            <Navbar.Brand>
                <Link to="/">UNIRIO GED App</Link>
            </Navbar.Brand>
            <Nav className="mr-auto">
                <NavDropdown title={
                    <>
                        <FontAwesomeIcon icon={faFileAlt} />
                        <span>{t('document.name')}</span>
                    </>
                }>
                    <Link to="/documents/" className="dropdown-item">
                        <FontAwesomeIcon className="icon" icon={faPlusCircle} />
                        {t('document.add')}
                    </Link>
                    <Link to="/" className="dropdown-item">
                        <FontAwesomeIcon className="icon" icon={faSearch} />
                        {t('document.search')}
                    </Link>
                </NavDropdown>
                <NavDropdown title={
                    <>
                        <FontAwesomeIcon icon={faCogs} />
                        <span>{t('management.name')}</span>
                    </>
                }>
                    <Link to="/categories" className="dropdown-item">
                        <FontAwesomeIcon className="icon" icon={faStream} />
                        {t('management.categories')}
                    </Link>
                    <Link to="/departments" className="dropdown-item">
                        <FontAwesomeIcon className="icon" icon={faHouseUser} />                        
                        {t('management.departments')}
                    </Link>
                    <Link to="/users" className="dropdown-item">
                        <FontAwesomeIcon className="icon" icon={faUserPlus} />
                        {t('management.users.invite')}
                    </Link>
                    <Link to="/permissions" className="dropdown-item">
                        <FontAwesomeIcon className="icon" icon={faKey} />
                        {t('management.users.permissions')}
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
                            <span>{t('language.title')}</span>
                            <FontAwesomeIcon icon={faLanguage} />
                        </>
                     }>
                        { languageList.map((lang, index) =>
                            <NavDropdown.Item key={index} onClick={() => { handleSwitchLanguage(lang.code) }} className={`${language === lang.code ? 'active' : '' }`}>
                                <img className="icon flag" alt={t(`language.${lang.code}.fullName`)} src={lang.imageUrl}/>
                                <span>{t(`language.${lang.code}.shortName`)}</span>
                            </NavDropdown.Item>
                        )}
                    </NavDropdown>
                </Nav>
                <Nav>
                    <NavDropdown title={
                        <>
                            <span>{`${t('department')}: ${user?.currentDepartment?.acronym}`}</span>
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
                        <span>{t('logout')}</span>
                        <FontAwesomeIcon icon={faSignOutAlt} />
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}
