import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { UserContext } from '../../contexts/UserContext'
import UserPermissionsTable from './UserPermissionsTable'
import '../../style/TablePage.css'

export default function Users({ permissionType }) {
    const { t } = useTranslation();
    const { checkPermission, department } = useContext(UserContext);

    return (
        <div className="header-n-table-div">
            <h1>{t(`users.${permissionType}.page.header`)}{ permissionType === 'department' && ` ${department?.acronym}`}</h1>
            <UserPermissionsTable
                canInviteUsers={permissionType === 'department' && checkPermission('INVITE_USERS')}
                canEditUserPermissions={
                    (permissionType === 'department' && checkPermission('MANAGE_DEPT_PERM'))
                    || (permissionType === 'system' && checkPermission('MANAGE_SYSTEM_PERM'))
                }
                canDeleteUsers={permissionType === 'department' && checkPermission('MANAGE_DEPT_PERM')}
                type={permissionType}
            />
        </div>
    )
}
