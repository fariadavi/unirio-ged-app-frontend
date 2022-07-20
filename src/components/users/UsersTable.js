import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../contexts/UserContext'
import { UserManagementContext } from '../../contexts/UserManagementContext'
import { useTranslation } from 'react-i18next'
import rq from '../../services/api'
import ReactTooltip from 'react-tooltip';
import { Form, Table } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBan, faCheck, faCheckCircle, faEdit, faPen, faFilter, faQuestion, faTrash, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import InviteUserRow from './InviteUserRow'
import UsersTableFilterRow from './UsersTableFilterRow'
import TablePagination from '../utils/TablePagination'
import '../../style/users/UsersTable.css'

const UsersTable = ({ permissions, disableDelete = false }) => {
    const { t } = useTranslation();
    const { checkPermission, department, user, setLoggedUserInfo } = useContext(UserContext);
    const { users, removeUser } = useContext(UserManagementContext);
    const [editingUsers, setEditingUsers] = useState([]);
    const [batchEditPermissions, setBatchEditPermissions] = useState(false);
    const [showFilterRow, setShowFilterRow] = useState(false);
    const [showInviteUserRow, setShowInviteUserRow] = useState(false);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [filterMap, setFilterMap] = useState({});
    const [pageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => setFilteredUsers([]), [department]);

    useEffect(() => {
        if (!users.length || !permissions.length)
            return;

        const evalBooleanFilter = (booleanValue, filter) => !filter || (filter === 'y' && booleanValue) || (filter === 'n' && !booleanValue)

        const evalContainsStringFilter = (string, filter) => !filter || string.toLowerCase().includes(filter)

        const evalPermissionFilter = (permission, userPermissionArray) => {
            return !filterMap[permission]
                || (filterMap[permission] === 'y' && userPermissionArray && userPermissionArray.includes(permission))
                || (filterMap[permission] === 'n' && (!userPermissionArray || !userPermissionArray.includes(permission)))
        }

        const start = (currentPage - 1) * pageSize;
        const end = (currentPage * pageSize) < users.length ? (currentPage * pageSize) : users.length;
        setFilteredUsers(
            users.filter(user =>
                evalBooleanFilter(user.fullName.trim().length, filterMap['status']) &&
                evalContainsStringFilter(user.fullName, filterMap['username']) &&
                evalContainsStringFilter(user.email, filterMap['email']) &&
                permissions.every(p => evalPermissionFilter(p, user.permissions))
            ).sort((a, b) => a.email.localeCompare(b.email)
            ).slice(start, end)
        );
    }, [users, filterMap, permissions, currentPage, pageSize]);

    const filterUsers = (filter, value) => setFilterMap(
        filter
            ? value
                ? { ...filterMap, [filter]: value }
                : () => { const { [filter]: removed, ...newFilterMap } = filterMap; return newFilterMap }
            : {}
    )

    const toggleUserPermission = (user, permission, add) => {
        const userPermissionArray = user.permissions || [];

        user.permissions = add
            ? [...userPermissionArray, permission]
            : userPermissionArray.filter(p => p !== permission);
    }

    const editUserPermissions = userId => setEditingUsers([...editingUsers, userId])

    const toggleBatchEditUserPermissions = () => {
        setBatchEditPermissions(!batchEditPermissions);
        setEditingUsers([]);
    }

    const cancelEditUserPermissions = userId => setEditingUsers(editingUsers.filter(x => x !== userId))

    const savePermissions = async (userId, permissions) => {
        // send permissionMap and userId to BE to update permissions of single user
        const res = await rq(`/users/${userId}/permission`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(permissions.map(p => p.toUpperCase()))
        });

        // if success continue
        if (!res.ok)
            throw Error();

        // stop editing saved user
        setEditingUsers(editingUsers.filter(x => x !== userId));

        if (userId === user?.id)
            setLoggedUserInfo();

        // show success message
    }

    const batchSavePermissions = async filteredUsers => {
        // send userPermissionMap to BE to update permissions of each user in filtered users
        let permissionsMap = {};
        filteredUsers.map(u => permissionsMap[u.id] = u.permissions);
        const res = await rq(`/users/permission`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(permissionsMap)
        });

        // if success continue
        if (!res.ok)
            throw Error();

        // stop batch editing users
        setBatchEditPermissions(false);

        if (filteredUsers.some(x => x.id === user?.id))
            setLoggedUserInfo();

        // show success message
    }

    const deleteUser = user => {
        // if user has permissions, 
        //   if user is the last with a necessary permission 
        //     block user delete
        //   confirm if should really be deleted
        //     if yes, continue, else cancel
        // delete user
        removeUser(user.id);
    }

    return (
        <div className="users-table-box">
            <Table id="usersTable" striped size="sm">
                <thead>
                    <tr>
                        <th width="104px">
                            <div className="center">
                                {t('user.table.headers.status')}
                            </div>
                        </th>
                        <th width="240px"><div>{t('user.table.headers.email')}</div></th>
                        <th width="280px"><div>{t('user.table.headers.username')}</div></th>
                        {permissions.map(p =>
                            <th key={`${p}`}>
                                <div className="center text-bottom">
                                    {t(`user.table.headers.permission.${p.toLowerCase()}`)}
                                </div>
                            </th>
                        )}
                        <th width="120px">
                            <div className="actions spaced">
                                {!batchEditPermissions
                                    ? (<>
                                        {checkPermission('INVITE_USERS')
                                            ? <span
                                                className={`icon ${showInviteUserRow ? 'active' : ''}`}
                                                data-for="inviteUserTooltip"
                                                data-tip={t('user.table.headers.buttons.invite')}
                                                onClick={() => {
                                                    if (showFilterRow) setShowFilterRow(false);
                                                    setShowInviteUserRow(!showInviteUserRow);
                                                }}>
                                                <FontAwesomeIcon className="icon" icon={faUserPlus} />
                                                <ReactTooltip id="inviteUserTooltip" />
                                            </span>
                                            : <></>}
                                        {checkPermission('MANAGE_DEPT_PERM')
                                            ? <span
                                                data-for="batchEditUserPermissionsTooltip"
                                                data-tip={t('user.table.headers.buttons.permissions.batch_edit')}
                                                onClick={() => toggleBatchEditUserPermissions()}
                                            >
                                                <FontAwesomeIcon className="icon" icon={faEdit} />
                                                <ReactTooltip id="batchEditUserPermissionsTooltip" />
                                            </span>
                                            : <></>}
                                        <span
                                            className={`icon ${showFilterRow ? 'active' : ''}`}
                                            data-for="filterTableTooltip"
                                            data-tip={t('user.table.headers.buttons.filter')}
                                            onClick={() => {
                                                if (showInviteUserRow) setShowInviteUserRow(false);
                                                if (showFilterRow) filterUsers();
                                                setShowFilterRow(!showFilterRow);
                                            }}>
                                            <ReactTooltip id="filterTableTooltip" />
                                            <FontAwesomeIcon className="icon" icon={faFilter} />
                                            <span className="activeFilterCount">
                                                {Object.keys(filterMap).length ? `(${Object.keys(filterMap).length})` : ''}
                                            </span>
                                        </span>
                                    </>)
                                    : (<>
                                        <span
                                            data-for="saveBatchEditTooltip"
                                            data-tip={t('user.table.headers.buttons.permissions.batch_edit.confirm')}
                                            onClick={() => batchSavePermissions(filteredUsers)}
                                        >
                                            <FontAwesomeIcon className="icon" icon={faCheckCircle} />
                                            <ReactTooltip id="saveBatchEditTooltip" />
                                        </span>
                                        <span
                                            data-for="cancelBatchEditTooltip"
                                            data-tip={t('user.table.headers.buttons.permissions.batch_edit.cancel')}
                                            onClick={() => toggleBatchEditUserPermissions()}
                                        >
                                            <FontAwesomeIcon className="icon" icon={faBan} />
                                            <ReactTooltip id="cancelBatchEditTooltip" />
                                        </span>
                                    </>)}
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {showFilterRow
                        ? <UsersTableFilterRow
                            filterMap={filterMap}
                            filterUsers={filterUsers}
                            permissions={permissions}
                            disabled={batchEditPermissions || editingUsers.length} />
                        : ''}
                    {showInviteUserRow
                        ? <InviteUserRow disabled={batchEditPermissions || editingUsers.length} />
                        : ''}
                    {filteredUsers.map(user => {
                        const rowEditDisabled = !batchEditPermissions && !editingUsers.includes(user.id);
                        return (
                            <tr key={user.id}>
                                <td>
                                    <div className="center">
                                        <span
                                            data-for={`user${user.id}StatusTooltip`}
                                            data-tip={
                                                user.fullName.trim().length
                                                    ? t('user.table.data.status.y')
                                                    : t('user.table.data.status.n')
                                            }>
                                            {user.fullName.trim().length
                                                ? <FontAwesomeIcon className="icon" icon={faCheck} />
                                                : <FontAwesomeIcon className="icon" icon={faQuestion} />}
                                            <ReactTooltip id={`user${user.id}StatusTooltip`} />
                                        </span>
                                    </div>
                                </td>
                                <td><div>{user.email}</div></td>
                                <td><div>{user.fullName}</div></td>
                                {permissions.map(p =>
                                    <td key={`${p}-${user.id}`}>
                                        <div className="center">
                                            <Form.Check
                                                className="check-input"
                                                type='checkbox'
                                                id={`${p}-${user.id}`}
                                                disabled={rowEditDisabled}
                                                onChange={e => toggleUserPermission(user, p, e.currentTarget.checked)}
                                                defaultChecked={user?.permissions && user.permissions.includes(p)}
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
                                                    {checkPermission('MANAGE_DEPT_PERM')
                                                        ? (<span
                                                            data-for={`editUser${user.id}PermissionButtonTooltip`}
                                                            data-tip={t('user.table.data.buttons.permissions.edit')}
                                                            onClick={() => editUserPermissions(user.id)}
                                                        >
                                                            <FontAwesomeIcon className="icon" icon={faPen} />
                                                            <ReactTooltip id={`editUser${user.id}PermissionButtonTooltip`} />
                                                        </span>)
                                                        : <></>}
                                                    {!disableDelete &&
                                                        <span
                                                            data-for={`deleteUser${user.id}ButtonTooltip`}
                                                            data-tip={t('user.table.data.buttons.user.delete')}
                                                            onClick={() => deleteUser(user)}
                                                        >
                                                            <FontAwesomeIcon className="icon" icon={faTrash} />
                                                            <ReactTooltip id={`deleteUser${user.id}ButtonTooltip`} />
                                                        </span>
                                                    }
                                                </>)
                                                : (<>
                                                    <span
                                                        data-for={`saveUser${user.id}PermissionsEditTooltip`}
                                                        data-tip={t('user.table.data.buttons.permissions.edit.confirm')}
                                                        onClick={() => savePermissions(user.id, user.permissions)}
                                                    >
                                                        <FontAwesomeIcon className="icon" icon={faCheckCircle} />
                                                        <ReactTooltip id={`saveUser${user.id}PermissionsEditTooltip`} />
                                                    </span>
                                                    <span
                                                        data-for={`cancelUser${user.id}PermissionsEditTooltip`}
                                                        data-tip={t('user.table.data.buttons.permissions.edit.cancel')}
                                                        onClick={() => cancelEditUserPermissions(user.id)}
                                                    >
                                                        <FontAwesomeIcon className="icon" icon={faBan} />
                                                        <ReactTooltip id={`cancelUser${user.id}PermissionsEditTooltip`} />
                                                    </span>
                                                </>)}
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
            <br />
            <TablePagination numPages={Math.ceil(users.length / pageSize)} activePage={currentPage} onSearch={page => setCurrentPage(page)} />
        </div>
    )
}

export default UsersTable;