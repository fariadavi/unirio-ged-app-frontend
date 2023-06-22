export const reqPermByPath = {
    '/': ['SEARCH_DOCS'],
    '/documents/new': ['ADD_DOCS'],
    '/documents/import': ['ADD_DOCS'],
    '/department/categories': ['MANAGE_CATEGORIES'],
    '/department/users': ['MANAGE_DEPT_PERM', 'INVITE_USERS'],
    '/system/departments': ['MANAGE_DEPARTMENTS'],
    '/system/users': ['MANAGE_SYSTEM_PERM']
}