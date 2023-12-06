import React from 'react'
import { Route, Switch } from 'react-router-dom'
import NavBar from './NavBar'
import Search from './search/Search'
import PageNotFound from './invalid/PageNotFound'
import Categories from './categories/Categories'
import Departments from './departments/Departments'
import Users from './users/Users'
import DocumentDetails from './documents/DocumentDetails'

export default function Home() {
    return (
        <div className="home-container">
            <NavBar />
            <Switch>
                <Route exact path="/">
                    <Search />
                </Route>
                <Route path="/documents">
                    <DocumentDetails />
                </Route>
                <Route path="/department/categories">
                    <Categories />
                </Route>
                <Route path="/department/users">
                    <Users type="department" />
                </Route>
                <Route path="/system/departments">
                    <Departments />
                </Route>
                <Route path="/system/users" >
                    <Users type="system" />
                </Route>
                <Route path="*">
                    <PageNotFound />
                </Route>
            </Switch>
        </div>
    )
}