import React from 'react'
import { Route, Switch } from 'react-router-dom';
import NavBar from './NavBar'
import Search from './search/Search'
import PageNotFound from './invalid/PageNotFound';
import Categories from './categories/Categories'
import Users from './users/Users'
import DocumentDetails from './documents/DocumentDetails'

export default function Home() {
    return (
        <div className="home-container">
            <NavBar />
            <Switch>
                <Route exact path="/" component={Search} />
                <Route path="/documents" component={DocumentDetails} />
                <Route path="/categories" component={Categories} />
                <Route path="/users" component={Users} />
                <Route path="*" component={PageNotFound} />
            </Switch>
        </div>
    )
}