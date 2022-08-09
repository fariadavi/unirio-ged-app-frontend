import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { UserContext } from '../../contexts/UserContext'
import {
    batchUpdateDepartments,
    deleteDepartment,
    getDepartments,
    insertDepartment,
    updateDepartment
} from '../../services/departments/api'
import CustomTable from '../util/CustomTable/CustomTable'
import { Icon } from '../util/CustomIcon'
import { faChevronRight, faEdit } from '@fortawesome/free-solid-svg-icons'

const DepartmentsTable = ({ canAddDept, canEditDept, canDeleteDept }) => {
    const { t } = useTranslation();
    const [departments, setDepartments] = useState([]);
    const { department, setLoggedUserInfo } = useContext(UserContext);

    const loadDepartments = useCallback(async () => {
        const res = await getDepartments();

        if (res.ok) setDepartments(await res.json());
    }, [])

    const addNewDepartment = useCallback(async departmentData => {
        const res = await insertDepartment(
            departmentData.acronym?.trim(),
            departmentData.name?.trim()
        );

        if (res.ok) {
            await loadDepartments();
            setLoggedUserInfo();
        }

        return res.ok;
    }, [loadDepartments, setLoggedUserInfo])

    const editDepartment = useCallback(async (departmentId, departmentData) => {
        const res = await updateDepartment(
            departmentId,
            departmentData.acronym?.trim(),
            departmentData.name?.trim()
        );

        if (res.ok) {
            await loadDepartments();
            setLoggedUserInfo();
        }

        return res.ok;
    }, [loadDepartments, setLoggedUserInfo])

    const batchEditDepartments = useCallback(async editedDepartmentEntries => {
        const res = await batchUpdateDepartments(
            editedDepartmentEntries
                .map(([deptId, deptData]) => {
                    return {
                        id: deptId,
                        acronym: deptData.acronym?.trim(),
                        name: deptData.name?.trim()
                    }
                }));

        if (res.ok) {
            await loadDepartments();
            setLoggedUserInfo();
        }

        return res.ok;
    }, [loadDepartments, setLoggedUserInfo])

    const removeDepartment = useCallback(async departmentId => {
        const res = await deleteDepartment(departmentId);

        if (res.ok) {
            await loadDepartments();
            setLoggedUserInfo();
        }

        return res.ok;
    }, [loadDepartments, setLoggedUserInfo])

    useEffect(() => loadDepartments(), [loadDepartments])

    const actions = {
        add: {
            disabled: !canAddDept,
            callbackFn: addNewDepartment
        },
        batchEdit: {
            disabled: !canEditDept,
            icon: faEdit,
            callbackFn: batchEditDepartments
        },
        edit: {
            disabled: !canEditDept,
            callbackFn: editDepartment
        },
        delete: {
            disabled: !canDeleteDept,
            callbackFn: removeDepartment
        }
    }

    const columns = {
        isCurrentDept: {
            class: 'text-align-end',
            editable: false,
            type: 'boolean',
            width: '32px',
            disguise: {
                true: <Icon 
                    icon={faChevronRight}
                    tooltip={t('departments.table.data.isCurrentDept.y')}
                />,
                false: <></>
            }
        },
        acronym: {
            class: 'center',
            header: t('departments.table.headers.acronym'),
            filterable: true,
            requiredOnAdd: true,
            type: 'text',
            width: '150px'
        },
        name: {
            header: t('departments.table.headers.name'),
            filterable: true,
            requiredOnAdd: true,
            type: 'text'
        }
    }

    const data = departments.map(dept => {
        return {
            ...dept,
            isCurrentDept: dept.id === department.id
        }
    })

    return (<CustomTable
        actions={actions}
        columns={columns}
        data={data}
        domain="departments"
    />)
}

export default DepartmentsTable;