import React, { useCallback, useEffect, useState } from 'react'
import { UserManagementProvider } from '../../contexts/UserManagementContext'
import { useTranslation } from 'react-i18next'
import rq from '../../services/api'
import UsersTable from './UsersTable'
import '../../style/users/Users.css'

export default function Users({ permissionType }) {
    const { t } = useTranslation();
    const [permissions, setPermissions] = useState([]);

    const getPermissions = useCallback(async () => {
        const res = await rq(`/permissions/${permissionType}`, { method: 'GET' });
        if (res.ok)
            setPermissions(await res.json());
    }, [permissionType])

    useEffect(() => getPermissions(), [getPermissions]);

    return (
        <UserManagementProvider>
            <div className="manage-users">
                <h1>{t('user.management.title')}</h1>
                <UsersTable permissions={permissions} disableDelete={true} />
            </div>
        </UserManagementProvider>
    )
}