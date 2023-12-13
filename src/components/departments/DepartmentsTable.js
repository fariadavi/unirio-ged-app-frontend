import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { UserContext } from '../../contexts/UserContext'
import { NotificationContext } from '../../contexts/NotificationContext'
import { NetworkContext } from '../../contexts/NetworkContext'
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
import { NotificationType } from '../notification/Notifications'
import { Button, Form, Modal } from 'react-bootstrap'

const DepartmentsTable = ({ canAddDept, canEditDept, canDeleteDept }) => {
    const { t } = useTranslation();
    const [departments, setDepartments] = useState([]);
    const { department, user, userLoading, setLoggedUserInfo } = useContext(UserContext);
    const { pushNotification } = useContext(NotificationContext);
    const { rq } = useContext(NetworkContext);
    const [isLoading, setLoading] = useState(true);
    const [deptBeingDeleted, setDeptBeingDeleted] = useState();

    useEffect(() => { if (userLoading) setLoading(true) }, [userLoading]);

    const loadDepartments = useCallback(async () => {
        setLoading(true);
        const res = await getDepartments(rq);
        setLoading(false);

        if (res.ok) setDepartments(await res.json());
    }, [rq])

    useEffect(() => loadDepartments(), [loadDepartments, department])

    const addNewDepartment = useCallback(async departmentData => {
        const res = await insertDepartment(
            rq,
            departmentData.acronym?.trim(),
            departmentData.name?.trim()
        );

        if (!res.ok) {
            pushNotification(
                NotificationType.ERROR,
                'departments.add.fail',
                { name: departmentData.name, acronym: departmentData.acronym }
            );
            return false;
        }

        pushNotification(
            NotificationType.SUCCESS,
            'departments.add.success',
            { name: departmentData.name, acronym: departmentData.acronym }
        );

        await loadDepartments();
        setLoggedUserInfo();
        return res.ok;
    }, [rq, pushNotification, loadDepartments, setLoggedUserInfo])

    const editDepartment = useCallback(async (departmentId, departmentData) => {
        const res = await updateDepartment(
            rq,
            departmentId,
            departmentData.acronym?.trim(),
            departmentData.name?.trim()
        );

        let currentDeptData = departments.filter(d => d.id === departmentId)?.[0];
        if (!res.ok) {
            let i18nKey = 'departments.edit.fail';
            if (res.status === 406) {
                let err = await res.json();
                i18nKey = `departments.edit.${err.i18nMsgKey}`;
            }

            pushNotification(
                NotificationType.ERROR,
                i18nKey,
                {
                    name: departmentData.name?.trim() || currentDeptData?.name,
                    acronym: departmentData.acronym?.trim() || currentDeptData?.acronym,
                    oldName: currentDeptData?.name,
                    oldAcronym: currentDeptData?.acronym
                });
            return false;
        }


        pushNotification(
            NotificationType.SUCCESS,
            'departments.edit.success',
            {
                name: departmentData.name?.trim() || currentDeptData?.name,
                acronym: departmentData.acronym?.trim() || currentDeptData?.acronym,
                oldName: currentDeptData?.name,
                oldAcronym: currentDeptData?.acronym
            });

        await loadDepartments();
        if (user?.departments?.some(dept => dept.id === Number(departmentId)))
            setLoggedUserInfo();
        return res.ok;
    }, [rq, user, departments, pushNotification, loadDepartments, setLoggedUserInfo])

    const batchEditDepartments = useCallback(async editedDepartmentEntries => {
        const res = await batchUpdateDepartments(
            rq,
            editedDepartmentEntries
                .map(([deptId, deptData]) => {
                    return {
                        id: deptId,
                        acronym: deptData.acronym?.trim(),
                        name: deptData.name?.trim()
                    }
                }));

        if (!res.ok) {
            pushNotification(NotificationType.ERROR, 'departments.batchEdit.fail');
            return false;
        }

        pushNotification(
            res.status === 206 ? NotificationType.WARNING : NotificationType.SUCCESS,
            `departments.batchEdit.${res.status === 206 ? 'partial' : 'success'}`
        );

        await loadDepartments();
        if (editedDepartmentEntries
            .some(([deptId]) =>
                user?.departments?.some(dept => dept.id === Number(deptId))
            ))
            setLoggedUserInfo();
        return res.ok;
    }, [rq, user, pushNotification, loadDepartments, setLoggedUserInfo])

    const triggerRemoveDepartment = async departmentId =>
        setDeptBeingDeleted(departments.filter(d => d.id === departmentId)?.[0]);

    const removeDepartment = useCallback(async (department) => {
        setDeptBeingDeleted();
        const res = await deleteDepartment(rq, department.id);

        if (!res.ok) {
            pushNotification(
                NotificationType.ERROR,
                'departments.delete.fail',
                { name: department.name, acronym: department.acronym }
            );
            return false;
        }

        pushNotification(
            NotificationType.SUCCESS,
            'departments.delete.success',
            { name: department.name, acronym: department.acronym }
        );

        await loadDepartments();

        if (user?.departments?.some(dept => dept.id === Number(department.id)))
            setLoggedUserInfo();
        return res.ok;
    }, [rq, user, pushNotification, loadDepartments, setLoggedUserInfo])

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
            callbackFn: triggerRemoveDepartment
        },
        filter: {}
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
            sort: true,
            type: 'text',
            width: '112px'
        },
        name: {
            header: t('departments.table.headers.name'),
            filterable: true,
            requiredOnAdd: true,
            type: 'text'
        },
        numUsers: {
            class: 'center',
            header: t('departments.table.headers.numUsers'),
            editable: false,
            type: 'number',
            width: '128px'
        }
    }

    const data = departments.map(dept => {
        return {
            ...dept,
            isCurrentDept: dept.id === department?.id
        }
    })

    const isDeleteConfirmationValid = deptBeingDeleted?.confirmation === (t('delete') + ' ' + deptBeingDeleted?.name);

    return <>
        <CustomTable
            actions={actions}
            columns={columns}
            data={data}
            isLoadingData={isLoading}
            domain="departments"
        />

        <Modal
            backdrop="static"
            className="confirm-delete-dept-modal"
            show={!!deptBeingDeleted}
            onEscapeKeyDown={() => { setDeptBeingDeleted(); }}
            onHide={() => { setDeptBeingDeleted(); }}
        >
            <Modal.Header closeButton={true}>
                <h5 className="title">{t('departments.warningModal.title')}</h5>
            </Modal.Header>
            <Modal.Body>
                <Trans
                    i18nKey='departments.warningModal.body.line1'
                    values={{ name: deptBeingDeleted?.name, acronym: deptBeingDeleted?.acronym }}
                    components={{ italic: <i />, bold: <strong /> }}
                />
                <br /><br />
                <Form.Text className="text-muted">
                    <Trans
                        i18nKey='departments.warningModal.body.line2'
                        values={{ name: deptBeingDeleted?.name }}
                        components={{ italic: <i />, bold: <strong /> }}
                    />
                </Form.Text>
                <Form.Control
                    type="text" name="title" required
                    onChange={e => setDeptBeingDeleted(dept => { return { ...dept, confirmation: e.target.value } })}
                    onKeyDown={e => { if (e.code === "Enter" && isDeleteConfirmationValid) removeDepartment(deptBeingDeleted); }}
                    isValid={isDeleteConfirmationValid}
                    isInvalid={deptBeingDeleted?.confirmation?.length > 0 && !isDeleteConfirmationValid}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => { setDeptBeingDeleted(); }}>
                    {t('departments.warningModal.btns.cancel')}
                </Button>
                <Button variant="danger" onClick={() => { removeDepartment(deptBeingDeleted); }}>
                    {t('departments.warningModal.btns.delete')}
                </Button>
            </Modal.Footer>
        </Modal>
    </>
}

export default DepartmentsTable;