import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { Container } from 'react-bootstrap'
import NavBar from './NavBar'
import SearchPage from './SearchPage'
import Categories from './Categories'
import UserPermissions from './UserPermissions'
import './style/SearchPage.css'

export default function Home() {
    let match = useRouteMatch();

    return (
        <Container className="d-flex flex-column align-item justify-content-center" style={{ minHeight: "100vh", minWidth: "95vw" }}>
            <NavBar />
            <Switch>
                <Route exact path="/" component={SearchPage} />
                <Route path="/categories" component={Categories} />
                <Route path="/users" component={UserPermissions} />
            </Switch>
        </Container>
    )
}