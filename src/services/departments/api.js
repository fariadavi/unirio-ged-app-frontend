import rq from '../../services/api'

const getDepartments = async () =>
    await rq('/departments/', { method: 'GET' });

const insertDepartment = async (acronym, name) =>
    await rq('/departments/', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ acronym: acronym, name: name })
    });

const updateDepartment = async (departmentId, acronym, name) =>
    await rq(`/departments/${departmentId}`, {
        method: 'PATCH',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ acronym: acronym, name: name })
    })

const batchUpdateDepartments = async departmentList =>
    await rq(`/departments/`, {
        method: 'PATCH',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(departmentList)
    })

const deleteDepartment = async departmentId =>
    await rq(`/departments/`, { method: 'DELETE' })

export {
    batchUpdateDepartments,
    deleteDepartment,
    getDepartments,
    insertDepartment,
    updateDepartment
};