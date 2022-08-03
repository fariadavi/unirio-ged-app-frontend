import React, { useCallback, useContext, useEffect, useState } from 'react'
import { UserManagementProvider } from '../../contexts/UserManagementContext'
import { UserContext } from '../../contexts/UserContext'
import { useTranslation } from 'react-i18next'
import rq from '../../services/api'
import UserPermissionsTable from './UserPermissionsTable'
import '../../style/users/Users.css'

export default function Users({ permissionType }) {
    const { t } = useTranslation();
    const [permissions, setPermissions] = useState([]);
    const { checkPermission } = useContext(UserContext);

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
                <UserPermissionsTable
                    canInviteUsers={permissionType === 'department' ? checkPermission('INVITE_USERS') : false}
                    canEditPermissions={permissionType === 'department' ? checkPermission('MANAGE_DEPT_PERM') :
                        permissionType === 'system' ? checkPermission('MANAGE_SYSTEM_PERM') : false}
                    permissions={permissions}
                    disableDelete={true}
                />
            </div>
        </UserManagementProvider>
    )
}