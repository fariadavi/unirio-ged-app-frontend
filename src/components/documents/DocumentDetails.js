import React from 'react'
import { Route, Switch, useParams, useRouteMatch } from 'react-router-dom';

const DocumentForm = () => {
    let { docId } = useParams();
    return (
        <div>
            <h1>DOCUMENT: {docId}</h1>
        </div>
    )
}

export default function DocumentDetails() {
    let match = useRouteMatch();

    return (
        <Switch>
            <Route path={`${match.path}/:docId`} component={DocumentForm} />
            <Route path={match.path} component={DocumentForm} />
        </Switch>
    )
}
