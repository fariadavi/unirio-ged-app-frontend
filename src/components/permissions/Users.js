import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { UserContext } from '../../contexts/UserContext'
import rq from '../../services/api'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import { Table } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBan, faCheckCircle, faEdit, faPen, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons'
import UsersTableFilterRow from './UsersTableFilterRow'
import '../../style/users/Users.css'

const UsersTable = () => {
    const { t } = useTranslation();
    const { department } = useContext(UserContext);
    const [users, setUsers] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [editingUsers, setEditingUsers] = useState([]);
    const [batchEditPermissions, setBatchEditPermissions] = useState(false);
    const [showFilterRow, setShowFilterRow] = useState(false);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [filterMap, setFilterMap] = useState({});

    useEffect(() => {
        rq(`/permissions`, { method: 'GET' })
            .then(res => { if (res.ok) return res.json() })
            .then(p => setPermissions(p));
    }, []);

    useEffect(() => {
        if (!department?.id)
            return;

        rq(`/users/department/${department.id}`, { method: 'GET' })
            .then(res => { if (res.ok) return res.json() })
            .then(u => setUsers(u));
    }, [department]);

    useEffect(() => {
        if (!users.length || !permissions.length)
            return;

        const evalContainsStringFilter = (username, filter) => !filter || username.toLowerCase().includes(filter)

        const evalPermissionFilter = (permission, userPermissionArray) => !filterMap[permission]
            || (filterMap[permission] === 'y' && userPermissionArray && userPermissionArray.includes(permission))
            || (filterMap[permission] === 'n' && (!userPermissionArray || !userPermissionArray.includes(permission)))

        setFilteredUsers(users.filter(user =>
            evalContainsStringFilter(user.fullName, filterMap['username']) &&
            evalContainsStringFilter(user.email, filterMap['email']) &&
            permissions.every(p => evalPermissionFilter(p, user.permissions))
        ));
    }, [users, filterMap, permissions]);

    const filterUsers = (filter, value) => {
        if (filter)
            setFilterMap({ ...filterMap, [filter]: value })
        else
            setFilterMap({});
    }

    const toggleUserPermission = (user, permission, add) => {    
        const userPermissionArray = user.permissions || [];

        user.permissions = add 
            ? [ ...userPermissionArray, permission ] 
            : userPermissionArray.filter(p => p !== permission);        
    }

    const editUserPermissions = userId => {
        setEditingUsers([...editingUsers, userId]);
    }

    const toggleBatchEditUserPermissions = () => {
        setBatchEditPermissions(!batchEditPermissions);
        setEditingUsers([]);
    }

    const cancelEditUserPermissions = userId => {
        setEditingUsers(editingUsers.filter(x => x !== userId))
    }

    const savePermissions = (userId, userPermissions) => {
        // send permissionMap and userId to BE to update permissions of single user
        // if success continue
        
        setEditingUsers(editingUsers.filter(x => x !== userId))

        // show success message
    }

    const batchSavePermissions = () => {
        // send userPermissionMap to BE to update permissions of each user
        // if success continue

        setBatchEditPermissions(false);

        // show success message
    }

    const deleteUser = user => {
        // if user has permissions, 
        //   if user is the last with a necessary permission 
        //     block user delete
        //   confirm if should really be deleted
        //     if yes, continue, else cancel
        // delete user
    }

    return (
        <>
            <div id="usersTable">
                <h1>{t('user.table.title')}</h1>
                <Table striped size="sm">
                    <thead>
                        <tr>
                            <th width="280px"><div>{t('user.table.headers.username')}</div></th>
                            <th width="240px"><div>{t('user.table.headers.email')}</div></th>
                            <th><div className="center">{t('user.table.headers.permission.1')}</div></th>
                            <th><div className="center">{t('user.table.headers.permission.2')}</div></th>
                            <th><div className="center">{t('user.table.headers.permission.3')}</div></th>
                            <th><div className="center">{t('user.table.headers.permission.4')}</div></th>
                            <th><div className="center">{t('user.table.headers.permission.5')}</div></th>
                            <th><div className="center">{t('user.table.headers.permission.6')}</div></th>
                            <th><div className="center">{t('user.table.headers.permission.7')}</div></th>
                            <th width="120px">
                                <div className="actions spaced">
                                    {!batchEditPermissions
                                        ? (<>
                                            <span onClick={() => toggleBatchEditUserPermissions()}>
                                                <FontAwesomeIcon className="icon" icon={faEdit} />
                                            </span>
                                            {!showFilterRow
                                                ? <span onClick={() => setShowFilterRow(true)}>
                                                    <FontAwesomeIcon className="icon" icon={faSearch} />
                                                </span>
                                                : <></>}
                                        </>)
                                        : (<>
                                            <span onClick={() => batchSavePermissions({})}>
                                                <FontAwesomeIcon className="icon" icon={faCheckCircle} />
                                            </span>
                                            <span onClick={() => toggleBatchEditUserPermissions()}>
                                                <FontAwesomeIcon className="icon" icon={faBan} />
                                            </span>
                                        </>)}
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <UsersTableFilterRow
                            filterMap={filterMap}
                            filterUsers={filterUsers}
                            permissions={permissions}
                            disabled={batchEditPermissions || editingUsers.length}
                            hideFilterBar={() => { setShowFilterRow(false); }}
                            visible={showFilterRow}
                        />
                        {filteredUsers.map(user => {
                            const rowEditDisabled = !batchEditPermissions && !editingUsers.includes(user.id);
                            return (
                                <tr key={user.id}>
                                    <td><div>{user.fullName}</div></td>
                                    <td><div>{user.email}</div></td>
                                    {permissions.map(p =>
                                        <td key={`${p.toLowerCase()}-${user.id}`}>
                                            <div className="center">
                                                <input
                                                    className="check-input"
                                                    type="checkbox"
                                                    disabled={rowEditDisabled}
                                                    id={`${p.toLowerCase()}-${user.id}`}
                                                    defaultChecked={user?.permissions && user.permissions.includes(p)}
                                                    onChange={e => toggleUserPermission(user, p, e.currentTarget.checked)}
                                                />
                                            </div>
                                        </td>
                                    )}
                                    <td>
                                        <div className="actions spaced">
                                            {batchEditPermissions
                                                ? <></>
                                                : rowEditDisabled
                                                    ? (<>
                                                        <span onClick={() => editUserPermissions(user.id)}>
                                                            <FontAwesomeIcon className="icon" icon={faPen} />
                                                        </span>
                                                        <span onClick={() => deleteUser(user)}>
                                                            <FontAwesomeIcon className="icon" icon={faTrash} />
                                                        </span>
                                                    </>)
                                                    : (<>
                                                        <span onClick={() => savePermissions(user.id, user.permissions)}>
                                                            <FontAwesomeIcon className="icon" icon={faCheckCircle} />
                                                        </span>
                                                        <span onClick={() => cancelEditUserPermissions(user.id)}>
                                                            <FontAwesomeIcon className="icon" icon={faBan} />
                                                        </span>
                                                    </>)}
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </div>
        </>
    )
}

export default function Users() {
    let match = useRouteMatch();

    return (
        <Switch>
            {/* <Route path={`${match.path}/:docId`} component={DocumentForm} /> */}
            <Route path={match.path} component={UsersTable} />
        </Switch>
    )
}
