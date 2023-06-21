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
    'customTable.filterRow.boolean.y': '$t(yes)',
    'customTable.filterRow.boolean.n': '$t(no)',
    'customTable.filterRow.clearBtn.tooltip': 'Clear all filters',

    // status badge
    'badge.status.pending': 'Pending',
    'badge.status.processing': 'Processing',
    'badge.status.processed': 'Processed',
    'badge.status.failed': 'Failed',
    'badge.status.empty_content': 'Empty Content',

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
    'navbar.documents.import': 'Import',
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
    'search.results.visualize.tooltip': 'Open',
    'search.results.download.tooltip': 'Download',
    'search.results.edit.tooltip': 'Edit',
    'search.results.delete.tooltip': 'Delete',
    'search.results.createdBy': 'Created by',
    'search.results.createdAt': 'on',
    'search.results.count': 'results',
    'search.results.page': 'Page',
    'search.results.page.of': 'of',
    
    // user
    'user.name': 'User Name',
    'user.email': 'Email',

    // department management
    // user permission page
    'users.department.page.header': 'Department Users',
    'users.system.page.header': 'System Users',

    // user table
    // headers
    'user.table.headers.status': 'Status',
    'user.table.headers.username': '$t(user.name)',
    'user.table.headers.email': '$t(user.email)',
    'user.table.headers.permission.search_docs': 'Search documents',
    'user.table.headers.permission.add_docs': 'Add documents',
    'user.table.headers.permission.edit_docs_others': 'Edit any document',
    'user.table.headers.permission.delete_docs_others': 'Delete any document',
    'user.table.headers.permission.invite_users': 'Invite users',
    'user.table.headers.permission.manage_categories': 'Manage categories',
    'user.table.headers.permission.manage_dept_perm': 'Manage department permissions',
    'user.table.headers.permission.manage_system_perm': 'Manage system permissions',
    'user.table.headers.permission.manage_departments': 'Manage departments',

    // action btn tooltips
    'userPermissions.customTable.actions.addBtn.tooltip': 'Invite user',
    'userPermissions.customTable.actions.batchEditBtn.tooltip': 'Edit users permissions',
    'userPermissions.customTable.actions.filterBtn.tooltip': 'Filter users',
    'userPermissions.customTable.actions.editBtn.tooltip': 'Edit user permissions',
    'userPermissions.customTable.actions.deleteBtn.tooltip': 'Remove user from this department',

    // user invite row
    'userPermissions.customTable.addRow.email.placeholder': 'Enter user mail',
    'userPermissions.customTable.addRow.validation.invalidEmailFormat': 'Invalid email format',
    'userPermissions.customTable.addRow.validation.invalidDomain': 'Email must belong to one of the following domains: @uniriotec.br or @edu.unirio.br',
    'userPermissions.customTable.addRow.addBtn.tooltip': 'Send Invite',
    
    // filter row
    'userPermissions.customTable.filterRow.fullName.placeholder': 'Filter by user name',
    'userPermissions.customTable.filterRow.email.placeholder': 'Filter by email',
    'userPermissions.customTable.filterRow.status.y': 'Active',
    'userPermissions.customTable.filterRow.status.n': 'Pending',
    
    // table data
    'user.table.data.status.y.tooltip': 'Active',
    'user.table.data.status.n.tooltip': 'Pending',

    // system management
    // departments page
    'departments.page.header': 'Departments',

    // departments table
    // headers
    'departments.table.headers.acronym': 'Acronym',
    'departments.table.headers.numUsers': 'User count',
    'departments.table.headers.name': 'Name',

    // action btn tooltips

    // add department row
    'departments.customTable.addRow.acronym.placeholder': 'Enter acronym for department',
    'departments.customTable.addRow.name.placeholder': 'Enter department name',
    'departments.customTable.addRow.addBtn.tooltip': 'Add new department',
    'departments.customTable.addRow.validation.acronymMaxLength': 'Acronym length must be 5 characters or fewer',
    'departments.customTable.addRow.validation.cantContainWhitespaces': 'Acronym can\'t contain whitespaces',
    
    // filter row
    'departments.customTable.filterRow.acronym.placeholder': 'Filter by acronym',
    'departments.customTable.filterRow.name.placeholder': 'Filter by department name',
    
    // table data
    'departments.table.data.isCurrentDept.y': 'Current department',

    // categories
    'categories.page.title': 'Categories',

    // import from google drive
    'import.page.title': 'Import from Google Drive',
    'import.table.headers.account': 'Account',
    'import.table.headers.name': 'Name',
    'import.table.headers.category': 'Category',
    'import.table.headers.date': 'Date',
    'import.table.headers.actions': 'Actions',
    'import.table.headers.popover.btns.primary.label': 'Set for all',
    'import.table.headers.popover.btns.secondary.label': 'Set for empty',
    'import.table.content.empty': 'No documents for import',
    'import.table.content.actions.import': 'Import',
    'import.page.btns.selectFromDrive': 'Select from Google Drive',
    'import.page.btns.switchAccount': 'Switch Account',
    'import.page.btns.removeSelected': 'Remove Selected',
    'import.page.btns.importSelected': 'Import Selected',
    'import.warningModal.title': '$t(category)',
    'import.warningModal.body.line1': 'There are items in the list for import.',
    'import.warningModal.body.line2': 'Do you want to append the new items to the list or replace them?',
    'import.warningModal.btns.cancel': 'Cancel',
    'import.warningModal.btns.append': 'Append',
    'import.warningModal.btns.replace': 'Replace',
}

export default enUS;