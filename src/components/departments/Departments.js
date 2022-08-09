import React from 'react'
import { useTranslation } from 'react-i18next'
import DepartmentsTable from './DepartmentsTable'
import '../../style/TablePage.css'

export default function Departments() {
    const { t } = useTranslation();

    return (
        <div className="header-n-table-div">
            <h1>{t('departments.page.header')}</h1>
            <DepartmentsTable
                canAddDept={true}
                canEditDept={true}
                canDeleteDept={false}
            />
        </div>
    )
}
