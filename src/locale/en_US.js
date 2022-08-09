const enUS = {
    // dictionary
    'yes': 'Yes',
    'no': 'No',
    'none': 'None',
    'document': 'Document',
    'document_plural': 'Documents',
    'category': 'Category',
    'category_plural': 'Categories',
    'department': 'Department',
    'department_plural': 'Departments',
    'user': 'User',
    'user_plural': 'Users',

    // utils
    'table.actions': 'Actions',
    'customButtons.add.tooltip': 'Add',
    'customButtons.edit.tooltip': 'Edit',
    'customButtons.confirm.tooltip': 'Confirm',
    'customButtons.cancel.tooltip': 'Cancel',
    'customButtons.filter.tooltip': 'Filter',
    'customButtons.delete.tooltip': 'Delete',
    'customButtons.clear.tooltip': 'Clear',
    'customTable.addRow.text.placeholder': 'Enter text',
    'customTable.addRow.validation.mandatoryField': 'Mandatory field',
    'customTable.filterRow.text.placeholder': 'Enter text to filter',
    'customTable.filterRow.clearBtn.tooltip': 'Clear all filters',

    // login
    'loginWithGoogle.buttonText': 'Sign in with Google',

    // pageNotFound
    'pageNotFound.title': '404',
    'pageNotFound.subtitle': 'Oops! Seems like this webpage doesn\'t exist...',
    'pageNotFound.message': 'Either the link you have is broken or this page refers to a content that has been moved or deleted.',
    'pageNotFound.home': 'Click here to go to the homepage',
    'pageNotFound.contactUs': 'If you believe that should be something here, please contact system administration.',

    // navbar
    'navbar.documents': '$t(document_plural)',
    'navbar.documents.add': 'Add New',
    'navbar.documents.search': 'Search',
    'navbar.department': '$t(department)',
    'navbar.department.category': '$t(category_plural)',
    'navbar.department.users': '$t(user_plural)',
    'navbar.system': 'System',
    'navbar.system.department': '$t(department_plural)',
    'navbar.system.users': '$t(user_plural)',
    'navbar.language': 'Language',
    'navbar.language.en-US.shortName': 'English',
    'navbar.language.en-US.fullName': 'American English',
    'navbar.language.pt-BR.shortName': 'Portuguese',
    'navbar.language.pt-BR.fullName': 'Brazilian Portuguese',
    'navbar.logout': 'Logout',

    // document
    'document.title': 'Title',
    'document.status': 'Status',
    'document.summary': 'Summary',
    'document.category': '$t(category)',
    'document.registeredBy': 'Registered by',
    'document.date': 'Document Date',

    // document form
    'document.form.add.title': 'New Document',
    'document.form.edit.title': 'Edit Document',
    'document.form.summary.mutedText': 'A brief description of the document being uploaded.',
    'document.form.category.choose': 'Choose a category...',
    'document.form.category.zeroOptions': 'No categories on current department',
    'document.form.file': 'File',
    'document.form.file.choose': 'Choose file',
    'document.form.file.placeholder': 'No file selected',
    'document.form.deleteButton': 'Delete',
    'document.form.updateButton': 'Update',
    'document.form.submitButton': 'Submit',
    'document.form.validation.fileRequired': 'You must attach a file',
    'document.form.validation.invalidFileType': 'File selected does not have a valid type',
    'document.form.validation.titleRequired': 'Title is required',
    'document.form.validation.categoryRequired': 'You must select a category',
    
    // document search
    'searchBar.filters.category': '$t(category)',
    'searchBar.filters.date.from': 'Date from',
    'searchBar.filters.date.until': 'until',
    'searchBar.searchButton': 'Search Documents',
    'searchBar.moreFiltersButton': 'More filters',
    'searchBar.lessFiltersButton': 'Less filters',
    'searchBar.filters.registeredByMe': 'Only documents registered by me',
    'search.noResultFound.message.p1': 'No results found',
    'search.noResultFound.message.p2': ' for ',
    'search.noResultFound.message.p3': ' with the specified filters.',
    'search.noResultFound.searchTips.title': 'Suggestions:',
    'search.noResultFound.searchTips.item1': 'Make sure all words are spelled correctly.',
    'search.noResultFound.searchTips.item2': 'Try using different/fewer keywords.',
    'search.noResultFound.searchTips.item3': 'Make sure all the optional filters are correctly filled up.',
    'search.noResultFound.searchTips.item4': 'Try removing the filters and re-add them gradually.',
    'search.error': 'There was an error performing the requested search. Please try again later.',
    
    // user
    'user.name': 'User Name',
    'user.email': 'Email',

    // user management
    'user.management.title': 'Manage Users',
    'user.management.invite.title': 'Invite User',
    'user.management.department-permissions.title': 'Manage Department Permissions',
    'user.management.system-permissions.title': 'Manage System Permissions',
    
    // user invite
    'user.management.invite.placeholder': 'Enter user mail',
    'user.management.invite.validation.invalidEmailFormat': 'Invalid email format',
    'user.management.invite.validation.invalidDomain': 'Email must belong to @uniriotec.br or @edu.unirio.br',
    'user.management.invite.button': 'Send Invite',

    // user table
    'user.table.headers.status': 'Status',
    'user.table.headers.username': '$t(user.name)',
    'user.table.headers.email': '$t(user.email)',
    'user.table.headers.permission.search_docs': 'Search documents',
    'user.table.headers.permission.add_docs': 'Add documents',
    'user.table.headers.permission.edit_docs_others': 'Edit other users\' documents',
    'user.table.headers.permission.delete_docs_others': 'Delete other users\' documents',
    'user.table.headers.permission.invite_users': 'Invite users',
    'user.table.headers.permission.manage_categories': 'Manage categories',
    'user.table.headers.permission.manage_dept_perm': 'Manage department permissions',
    'user.table.headers.permission.manage_system_perm': 'Manage system permissions',
    'user.table.headers.permission.manage_departments': 'Manage departments',
    'user.table.filters.text.username': 'Filter by user name',
    'user.table.filters.text.email': 'Filter by email',
    'user.table.filters.boolean.y': '$t(yes)',
    'user.table.filters.boolean.n': '$t(no)',
    'user.table.filters.status.y': 'Active',
    'user.table.filters.status.n': 'Pending',
    'user.table.headers.buttons.invite': 'Invite user',
    'user.table.headers.buttons.filter': 'Filter users',
    'user.table.headers.buttons.permissions.batch_edit': 'Edit users permissions in batch',
    'user.table.headers.buttons.permissions.batch_edit.confirm': 'Confirm',
    'user.table.headers.buttons.permissions.batch_edit.cancel': 'Cancel',
    'user.table.filters.buttons.clear': 'Clear all filters',
    'user.table.data.status.y': 'Active',
    'user.table.data.status.n': 'Pending',
    'user.table.data.buttons.permissions.edit': 'Edit user permissions',
    'user.table.data.buttons.permissions.edit.confirm': 'Confirm',
    'user.table.data.buttons.permissions.edit.cancel': 'Cancel',
    'user.table.data.buttons.user.delete': 'Remove user from this department',

    //system management
    //departments page
    'departments.page.header': 'Manage Departments',

    //departments table
    'departments.table.headers.acronym': 'Acronym',
    'departments.table.headers.name': 'Name',
    'departments.table.data.isCurrentDept.y': 'Current department',
    'departments.customTable.addRow.acronym.placeholder': 'Enter acronym for department',
    'departments.customTable.addRow.name.placeholder': 'Enter department name',
}

export default enUS;