import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { UserContext } from '../../contexts/UserContext'
import {
    batchUpdateUsersPermissions,
    deleteUser,
    getPermissions,
    getUsers,
    insertUser,
    updateUserPermissions
} from '../../services/users/api'
import CustomTable from '../util/CustomTable/CustomTable'
import { Icon } from '../util/CustomIcon'
import { faUserCheck, faQuestion, faPaperPlane, faUserPlus, faEdit } from '@fortawesome/free-solid-svg-icons'

const UserPermissionsTable = ({ canInviteUsers, canEditUserPermissions, canDeleteUsers, type }) => {
    const { t } = useTranslation();
    const [users, setUsers] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const { department, user, setLoggedUserInfo } = useContext(UserContext);
    const [isLoading, setLoading] = useState(true);

    const loadUsers = useCallback(async () => {
        setLoading(true);
        const res = await getUsers(type);
        setLoading(false);

        if (res.ok) setUsers(await res.json());
    }, [type])

    useEffect(() => loadUsers(), [loadUsers, department, type])

    const loadPermissions = useCallback(async () => {
        if (!canEditUserPermissions) {
            setPermissions([]);
            return;
        }

        const res = await getPermissions(type);
        if (res.ok) setPermissions(await res.json());
    }, [canEditUserPermissions, type])

    useEffect(() => loadPermissions(), [loadPermissions, type])

    const addNewUser = useCallback(async userData => {
        const res = await insertUser(userData.email);

        if (res.ok) await loadUsers();

        return res.ok;
    }, [loadUsers])

    const getSpecificUserPermissions = (allUsers, userId, possiblePermissions) =>
        allUsers
            ?.find(u => u.id === Number(userId))
            ?.permissions
            ?.filter(p => possiblePermissions.includes(p))

    const addOrRemoveFromArray = (array, key, keyShouldBeInArray) =>
        array.includes(key)
            ? keyShouldBeInArray
                ? array
                : array.filter(k => k !== key)
            : [...array, key]

    const editUserPermissionsWithNewUserData = useCallback((userPermissions, userNewData) =>
        Object
            .entries(userNewData)
            .reduce((array, [key, value]) =>
                addOrRemoveFromArray(array, key, value),
                userPermissions
            )
        , []);

    const editUserPermissions = useCallback(async (userId, userNewData) => {
        const res = await updateUserPermissions(
            userId,
            editUserPermissionsWithNewUserData(
                getSpecificUserPermissions(users, userId, permissions),
                userNewData
            ),
            type
        );

        if (res.ok) {
            await loadUsers();
            if (user?.id === Number(userId)) setLoggedUserInfo();
        }

        return res.ok;
    }, [type, permissions, user?.id, users, loadUsers, setLoggedUserInfo, editUserPermissionsWithNewUserData])

    const batchEditUsersPermissions = useCallback(async editedUserEntries => {
        const res = await batchUpdateUsersPermissions(
            Object.fromEntries(
                editedUserEntries.map(([userId, userNewData]) => [
                    userId,
                    editUserPermissionsWithNewUserData(
                        getSpecificUserPermissions(users, userId, permissions),
                        userNewData
                    )
                ])),
                type
        );

        if (res.ok) {
            await loadUsers();

            if (editedUserEntries.some(([userId]) => user?.id === Number(userId)))
                setLoggedUserInfo();
        }

        return res.ok;
    }, [type, permissions, user?.id, users, loadUsers, setLoggedUserInfo, editUserPermissionsWithNewUserData])

    const removeUserFromDepartment = useCallback(async userId => {
        const res = await deleteUser(userId)

        if (res.ok) {
            await loadUsers();
            if (user?.id === Number(userId)) setLoggedUserInfo();
        }

        return res.ok;
    }, [user, loadUsers, setLoggedUserInfo])

    const actions = {
        add: {
            disabled: !canInviteUsers,
            callbackFn: addNewUser,
            icon: faUserPlus,
            rowActionIcon: faPaperPlane,
        },
        batchEdit: {
            disabled: !canEditUserPermissions,
            callbackFn: batchEditUsersPermissions,
            icon: faEdit,
        },
        edit: {
            disabled: !canEditUserPermissions,
            callbackFn: editUserPermissions,
        },
        delete: {
            disabled: !canDeleteUsers,
            callbackFn: removeUserFromDepartment,
        },
        filter: {}
    }

    const columns = useMemo(() => {
        return {
            status: {
                class: 'center',
                disguise: {
                    true: <Icon
                        icon={faUserCheck}
                        tooltip={t('user.table.data.status.y.tooltip')}
                    />,
                    false: <Icon
                        icon={faQuestion}
                        tooltip={t('user.table.data.status.n.tooltip')}
                    />
                },
                editable: false,
                filterable: true,
                header: t('user.table.headers.status'),
                type: 'boolean',
                width: '104px'
            },
            email: {
                header: t('user.table.headers.email'),
                editable: false,
                filterable: true,
                requiredOnAdd: true,
                sort: true,
                type: 'text'
            },
            fullName: {
                header: t('user.table.headers.username'),
                editable: false,
                filterable: true,
                type: 'text'
            },
            ...Object.fromEntries(
                permissions.map(perm => [perm, {
                    class: 'center',
                    header: t(`user.table.headers.permission.${perm.toLowerCase()}`),
                    // editable: perm !== 'SEARCH_DOCS',
                    filterable: true,
                    type: 'boolean',
                    width: (125 + ((7 - permissions.length) * 30)) + 'px'
                }])
            )
        }
    }, [permissions, t]);

    const data = useMemo(() => users.map(user => {
        return {
            ...user,
            status: user.fullName?.trim().length > 0,
            ...Object.fromEntries(
                permissions.map(perm =>
                    [perm, user.permissions.includes(perm)]
                )
            )
        }
    }), [permissions, users]);

    return (<CustomTable
        actions={actions}
        columns={columns}
        data={data}
        isLoadingData={isLoading}
        domain={`userPermissions`}
    />)

}

export default UserPermissionsTable;