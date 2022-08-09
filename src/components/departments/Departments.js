import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { UserContext } from '../../contexts/UserContext'
import DepartmentsTable from './DepartmentsTable'
import '../../style/TablePage.css'

export default function Departments() {
    const { t } = useTranslation();
    const { checkPermission } = useContext(UserContext);
    const canManageDepts = checkPermission('MANAGE_DEPARTMENTS');

    return (
        <div className="header-n-table-div">
            <h1>{t('departments.page.header')}</h1>
            <DepartmentsTable
                canAddDept={canManageDepts}
                canEditDept={canManageDepts}
                canDeleteDept={false}
            />
        </div>
    )
}
