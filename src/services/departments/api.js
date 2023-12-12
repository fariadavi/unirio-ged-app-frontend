const getDepartments = async (rq) =>
    await rq('/departments/', { method: 'GET' });

const insertDepartment = async (rq, acronym, name) =>
    await rq('/departments/', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ acronym: acronym, name: name })
    });

const updateDepartment = async (rq, departmentId, acronym, name) =>
    await rq(`/departments/${departmentId}`, {
        method: 'PATCH',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ acronym: acronym, name: name })
    })

const batchUpdateDepartments = async (rq, departmentList) =>
    await rq(`/departments/`, {
        method: 'PATCH',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(departmentList)
    })

const deleteDepartment = async (rq, departmentId) =>
    await rq(`/departments/${departmentId}`, { method: 'DELETE' })

export {
    batchUpdateDepartments,
    deleteDepartment,
    getDepartments,
    insertDepartment,
    updateDepartment
};