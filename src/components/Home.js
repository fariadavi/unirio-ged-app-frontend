import React from 'react'
import { Route, Switch } from 'react-router-dom';
import NavBar from './NavBar'
import Search from './search/Search'
import PageNotFound from './invalid/PageNotFound';
import Categories from './categories/Categories'
import UserPermissions from './permissions/UserPermissions'
import DocumentDetails from './documents/DocumentDetails'
import DocumentDetails2 from './documents/DocumentDetails2'

export default function Home() {
    return (
        <div className="home-container">
            <NavBar />
            <Switch>
                <Route exact path="/" component={Search} />
                <Route path="/documents" component={DocumentDetails} />
                <Route path="/documents2" component={DocumentDetails2} />
                <Route path="/categories" component={Categories} />
                <Route path="/users" component={UserPermissions} />
                <Route path="*" component={PageNotFound} />
            </Switch>
        </div>
    )
}