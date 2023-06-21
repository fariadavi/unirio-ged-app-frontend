import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { UserContext } from '../../contexts/UserContext'
import UserPermissionsTable from './UserPermissionsTable'
import '../../style/TablePage.css'

export default function Users({ type }) {
    const { t } = useTranslation();
    const { checkPermission, department } = useContext(UserContext);

    return (
        <div className="header-n-table-div">
            <h1>{t(`users.${type}.page.header`)}{ type === 'department' && ` ${department?.acronym}`}</h1>
            <UserPermissionsTable
                canInviteUsers={type === 'department' && checkPermission('INVITE_USERS')}
                canEditUserPermissions={
                    (type === 'department' && checkPermission('MANAGE_DEPT_PERM'))
                    || (type === 'system' && checkPermission('MANAGE_SYSTEM_PERM'))
                }
                canDeleteUsers={type === 'department' && checkPermission('MANAGE_DEPT_PERM')}
                type={type}
            />
        </div>
    )
}
