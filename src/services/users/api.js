import rq from '../../services/api'

const getUsers = async (type) =>
    await rq(`/users${type === 'department' ? '/currentdept' : ''}`, { method: 'GET' });

const getPermissions = async type =>
    await rq(`/permissions/${type}`, { method: 'GET' });

const insertUser = async email =>
    await rq('/users/invite', {
        method: 'POST',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `email=${email}`
    })

const updateUserPermissions = async (userId, permissionsArray, type) =>
    await rq(`/users/${userId}/permission${type ? `?type=${type}` : ''}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(permissionsArray)
    })

const batchUpdateUsersPermissions = async permissionsUpdateMap =>
    await rq(`/users/permission`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(permissionsUpdateMap)
    })

const deleteUser = async userId =>
    await rq(`/users/${userId}`, { method: 'DELETE' })

export {
    batchUpdateUsersPermissions,
    deleteUser,
    getPermissions,
    getUsers,
    insertUser,
    updateUserPermissions
};