import React from 'react'
import { Container } from 'react-bootstrap'
import { Route, Switch } from 'react-router-dom';
import NavBar from './NavBar'
import Search from './search/Search'
import PageNotFound from './invalid/PageNotFound';
import Categories from './categories/Categories'
import UserPermissions from './permissions/UserPermissions'
import DocumentDetails from './documents/DocumentDetails';

export default function Home() {
    return (
        <Container className="d-flex flex-column align-item justify-content-center" style={{ minHeight: "100vh", minWidth: "95vw" }}>
            <NavBar />
            <Switch>
                <Route exact path="/" component={Search} />
                <Route path="/documents" component={DocumentDetails} />
                <Route path="/categories" component={Categories} />
                <Route path="/users" component={UserPermissions} />
                <Route path="*" component={PageNotFound} />
            </Switch>
        </Container>
    )
}