import React, { useEffect, useState } from 'react'
import { UserManagementProvider } from '../../contexts/UserManagementContext'
import { useTranslation } from 'react-i18next'
import rq from '../../services/api'
import UsersTable from './UsersTable'
import '../../style/users/Users.css'

export default function Users() {
    const { t } = useTranslation();
    const [deptPermissions, setDeptPermissions] = useState([]);

    const getPermissions = async () => {
        const departmentPermissionsRes = await rq('/permissions/department', { method: 'GET' });
        if (departmentPermissionsRes.ok)
            setDeptPermissions(await departmentPermissionsRes.json());
    }

    useEffect(() => getPermissions(), []);

    return (
        <UserManagementProvider>
            <div className="manage-users">
                <h1>{t('user.management.title')}</h1>
                <UsersTable permissions={deptPermissions} disableDelete={true} />
            </div>
        </UserManagementProvider>
    )
}