import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { UserContext } from '../contexts/UserContext'
import { Link } from 'react-router-dom'
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'
import { getUserLanguage, setUserLanguage } from '../services/lang'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCogs, faExchangeAlt, faFileAlt, faHouseUser, faKey, faLanguage, faPlusCircle, faSearch, faStream, faUser, faUserPlus, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import '../style/NavBar.css'

export default function NavBar() {
    const { t, i18n } = useTranslation();
    const { user, changeDepartment, logoutUser } = useContext(UserContext);
    const [ language, setLanguage ] = useState(getUserLanguage());
    const languageList = Object.keys(i18n.store.data)

    useEffect(() => {
        i18n.changeLanguage(language)
        setUserLanguage(language || navigator.language || navigator.userLanguage)
    }, [i18n, language])

    const handleSwitchLanguage = langCode => { if (langCode !== language) setLanguage(langCode) };

    return (
        <Navbar fixed="top" bg="dark" variant="dark" expand="sm">
            <Navbar.Brand>
                <Link to="/">
                    <img height='28px' alt='' src='/images/logo_unirio.svg'  style={{ margin: '-6px 6px 0 0' }}/>
                    UNIRIO GED App 
                </Link>
            </Navbar.Brand>
            <Nav className="mr-auto">
                <NavDropdown title={
                    <>
                        <FontAwesomeIcon icon={faFileAlt} />
                        <span>{t('document')}</span>
                    </>
                }>
                    <Link to="/documents/" className="dropdown-item">
                        <FontAwesomeIcon className="icon" icon={faPlusCircle} />
                        {t('document.add')}
                    </Link>
                    <Link to="/documents2/" className="dropdown-item">
                        <FontAwesomeIcon className="icon" icon={faPlusCircle} />
                        {t('document.add')}2
                    </Link>
                    <Link to="/" className="dropdown-item">
                        <FontAwesomeIcon className="icon" icon={faSearch} />
                        {t('document.search')}
                    </Link>
                </NavDropdown>
                <NavDropdown title={
                    <>
                        <FontAwesomeIcon icon={faCogs} />
                        <span>{t('management')}</span>
                    </>
                }>
                    <Link to="/categories" className="dropdown-item">
                        <FontAwesomeIcon className="icon" icon={faStream} />
                        {t('category_plural')}
                    </Link>
                    <Link to="/departments" className="dropdown-item">
                        <FontAwesomeIcon className="icon" icon={faHouseUser} />                        
                        {t('department_plural')}
                    </Link>
                    <Link to="/users" className="dropdown-item">
                        <FontAwesomeIcon className="icon" icon={faUserPlus} />
                        {t('user.invite')}
                    </Link>
                    <Link to="/permissions" className="dropdown-item">
                        <FontAwesomeIcon className="icon" icon={faKey} />
                        {t('user.permissions')}
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
                            <span>{t('language')}</span>
                            <FontAwesomeIcon icon={faLanguage} />
                        </>
                     }>
                        { languageList.map((lang, index) =>
                            <NavDropdown.Item key={index} onClick={() => { handleSwitchLanguage(lang) }} className={`${language === lang ? 'active' : '' }`}>
                                <img className="icon flag" alt={t(`language.${lang}.fullName`)} src={`/images/${lang}.svg`}/>
                                <span>{t(`language.${lang}.shortName`)}</span>
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
                            <NavDropdown.Item key={dept.id} onClick={() => { changeDepartment(dept.id) }} className={`${dept.id === user?.currentDepartment?.id ? 'active' : '' }`}>
                                {`${dept.name} (${dept.acronym})`}
                            </NavDropdown.Item>
                        )}
                    </NavDropdown>
                </Nav>
                <Nav>
                    <Nav.Link onClick={logoutUser}>
                        <span>{t('logout')}</span>
                        <FontAwesomeIcon icon={faSignOutAlt} />
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}
