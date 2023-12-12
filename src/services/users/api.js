const getUsers = async (rq, type) =>
    await rq(`/users${type === 'department' ? '/currentdept' : ''}`, { method: 'GET' });

const getPermissions = async (rq, type) =>
    await rq(`/permissions/${type}`, { method: 'GET' });

const insertUser = async (rq, email) =>
    await rq('/users/invite', {
        method: 'POST',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `email=${email}`
    })

const updateUserPermissions = async (rq, userId, permissionsArray, type) =>
    await rq(`/users/${userId}/permission${type ? `?type=${type}` : ''}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(permissionsArray)
    })

const batchUpdateUsersPermissions = async (rq, permissionsUpdateMap, type) =>
    await rq(`/users/permission${type ? `?type=${type}` : ''}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(permissionsUpdateMap)
    })

const deleteUser = async (rq, userId) =>
    await rq(`/users/${userId}`, { method: 'DELETE' })

export {
    batchUpdateUsersPermissions,
    deleteUser,
    getPermissions,
    getUsers,
    insertUser,
    updateUserPermissions
};