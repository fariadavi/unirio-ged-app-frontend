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
    'delete': 'delete',
    'warning': 'Warning',

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
    'select.loading': 'Loading...',

    // status
    'status.pending': 'Pending',
    'status.processing': 'Processing',
    'status.processed': 'Processed',
    'status.failed_import': 'Import failed',
    'status.failed_processing': 'Processing failed',
    'status.empty_content': 'Empty Content',

    // notifications
    'notifications.header.default.success': 'Sucess',
    'notifications.header.default.warning': '$t(warning)',
    'notifications.header.default.error': 'Error',
    'notifications.header.default.info': 'Information',

    // login
    'loginWithGoogle.buttonText': 'Sign in with Google',
    'login.fail.userNotFound': 'User not found.',
    'login.fail.unknownError': 'Unknown error on login. $t(rq.fail.pleaseTryAgainLater)',
    
    //rq
    'rq.fail.pleaseTryAgainLater': 'Please try again later.\n\nIf the problem persists, contact the system administrators.',
    'rq.fail.unexpectedError': 'An unexpected error has ocurred. $t(rq.fail.pleaseTryAgainLater)',

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
    'document.actions.add.success': 'Successfully created document \'<bold>{{name}}</bold>\'!',
    'document.actions.add.fail': 'Failed to create document \'<bold>{{name}}</bold>\'. $t(rq.fail.pleaseTryAgainLater)',
    'document.actions.update.success': 'Successfully updated document \'<bold>{{name}}</bold>\'!',
    'document.actions.update.fail': 'Failed to update document \'<bold>{{name}}</bold>\'. $t(rq.fail.pleaseTryAgainLater)',
    'document.actions.delete.success': 'Successfully deleted document \'<bold>{{name}}</bold>\'!',
    'document.actions.delete.fail': 'Failed to delete document \'<bold>{{name}}</bold>\'. $t(rq.fail.pleaseTryAgainLater)',
    'documents.actions.download.fail': 'Failed retrieving file \'<bold>{{name}}</bold>\' from server. $t(rq.fail.pleaseTryAgainLater)',
    'document.import.upload.success': 'Selected documents were succesfully uploaded to the server and will be imported on the background.',
    'document.import.upload.fail': 'Failed to upload selected documents to the server. $t(rq.fail.pleaseTryAgainLater)',

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
    'document.form.updateButton': 'Save Changes',
    'document.form.submitButton': 'Submit',
    'document.form.validation.fileRequired': 'You must attach a file',
    'document.form.validation.invalidFileType': 'File selected does not have a valid type',
    'document.form.validation.titleRequired': 'Title is required',
    'document.form.validation.categoryRequired': 'You must select a category',
    
    // document search
    'searchBar.filters.category': '$t(category)',
    'searchBar.filters.date.from': 'Date from',
    'searchBar.filters.date.until': 'until',
    'searchBar.filters.status': 'Status',
    'searchBar.filters.status.choose': 'Choose a status...',
    'searchBar.filters.status.zeroOptions': 'No status to filter by',
    'searchBar.searchButton': 'Search Documents',
    'searchBar.moreFiltersButton': 'More filters',
    'searchBar.lessFiltersButton': 'Less filters',
    'searchBar.filters.registeredByMe': 'Registered by me',
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
    'search.validation.noParameters': 'Fill at least one field to perform a search.',
    
    // user
    'user.name': 'User Name',
    'user.email': 'Email',
    'user.loggedUserInfo.fail': 'Failed to retrieve user information from server. $t(rq.fail.pleaseTryAgainLater)',
    'user.changeDepartment.fail': 'Failed to change departments. $t(rq.fail.pleaseTryAgainLater)',

    // department management
    // user permission page (department)
    'users.department.page.header': 'Department Users',
    'users.department.invite.success': 'Succesfully invited user <bold>{{user}}</bold> to departament <bold>{{dept}}</bold>!',
    'users.department.invite.fail': 'Failed to invite user <bold>{{user}}</bold> to departament <bold>{{dept}}</bold>. $t(rq.fail.pleaseTryAgainLater)',
    'users.department.invite.exception.userAlreadyInvited': 'User <bold>{{user}}</bold> already has access to departament <bold>{{dept}}</bold>.',
    'users.department.edit.success': 'Successfully updated permissions of user <bold>{{user}}</bold> on departament <bold>{{dept}}</bold>!',
    'users.department.edit.fail': 'Failed to update permissions of user <bold>{{user}}</bold> on departament <bold>{{dept}}</bold>. $t(rq.fail.pleaseTryAgainLater)',
    'users.department.edit.exception.lastRemainingDeptManager': 'It\'s not possible to remove permission \'<i>$t(user.table.headers.permission.manage_dept_perm)</i>\' from user <bold>{{user}}</bold> on departament <bold>{{dept}}</bold> because that\'s the only user with that permission on this department!\n\nGrant \'<i>$t(user.table.headers.permission.manage_dept_perm)</i>\' permission to other user and then try again.',
    'users.department.batchEdit.success': 'Successfully updated user permissions on departament <bold>{{dept}}</bold>!',
    'users.department.batchEdit.partial': 'Partial success.\nSome user permissions couldn\'t be updated.',
    'users.department.batchEdit.fail': 'Failed to update user permissions on departament <bold>{{dept}}</bold>. $t(rq.fail.pleaseTryAgainLater)',
    'users.department.batchEdit.exception.lastRemainingDeptManager': 'It was not possible to update all the user permissions because one of the users is the only one in departament <bold>{{dept}}</bold> with permission \'<i>$t(user.table.headers.permission.manage_dept_perm)</i>\'!\n\nGrant \'<i>$t(user.table.headers.permission.manage_dept_perm)</i>\' permission to other user and then try again.',
    'users.department.delete.success': 'Successfully removed access of <bold>{{user}}</bold> to departament <bold>{{dept}}</bold>!',
    'users.department.delete.fail': 'Failed to remove access to user <bold>{{user}}</bold> to departament <bold>{{dept}}</bold>. $t(rq.fail.pleaseTryAgainLater)',
    'users.department.delete.exception.lastRemainingDeptManager': 'It\'s not possible to remove access from user <bold>{{user}}</bold> to departament <bold>{{dept}}</bold> that\'s the only user with \'<i>$t(user.table.headers.permission.manage_dept_perm)</i>\' permission on department <bold>{{dept}}</bold>!\n\nGrant \'<i>$t(user.table.headers.permission.manage_dept_perm)</i>\' permission to other user and then try again.',

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
    'departments.add.success': 'Successfully created department <bold>{{name}}</bold> (<bold>{{acronym}}</bold>)!',
    'departments.add.fail': 'Failed to create new department <bold>{{name}}</bold> (<bold>{{acronym}}</bold>). $t(rq.fail.pleaseTryAgainLater)',
    'departments.edit.success': 'Successfully updated department <bold>{{oldName}}</bold> (<bold>{{oldAcronym}}</bold>) to <bold>{{name}}</bold> (<bold>{{acronym}}</bold>)!',
    'departments.edit.fail': 'Failed to update department <bold>{{oldName}}</bold> (<bold>{{oldAcronym}}</bold>) to <bold>{{name}}</bold> (<bold>{{acronym}}</bold>). $t(rq.fail.pleaseTryAgainLater)',
    'departments.edit.exception.departmentAcronymLengthOverflow': 'It\'s not possible to update <bold>{{oldAcronym}}</bold>\'s department acronym to <bold>{{acronym}}</bold> because the acronym\'s allowed max length is 5 characters.',
    'departments.batchEdit.success': 'Successfully updated departments!',
    'departments.batchEdit.partial': 'Partial success.\nSome departaments couldn\'t be updated.',
    'departments.batchEdit.fail': 'Failed to update departments. $t(rq.fail.pleaseTryAgainLater)',
    'departments.delete.success': 'Successfully deleted department <bold>{{name}}</bold> (<bold>{{acronym}}</bold>)!',
    'departments.delete.fail': 'Failed to delete department <bold>{{name}}</bold> (<bold>{{acronym}}</bold>). $t(rq.fail.pleaseTryAgainLater)',

    // warning modal
    'departments.warningModal.title': '$t(warning)',
    'departments.warningModal.body.line1': 'Do you want to permanently delete department <bold>{{name}}</bold> (<bold>{{acronym}}</bold>) and all it\'s contents?',
    'departments.warningModal.body.line2': 'To confirm type "<bold>$t(delete) {{name}}</bold>" in the textbox below:',
    'departments.warningModal.btns.cancel': 'Cancel',
    'departments.warningModal.btns.delete': 'Delete',

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

    // user permission page (system)
    'users.system.page.header': 'System Users',
    'users.system.edit.success': 'Succesfully updated user <bold>{{user}}</bold> permissions!',
    'users.system.edit.fail': 'Failed to update user <bold>{{user}}</bold> permissions. $t(rq.fail.pleaseTryAgainLater)',
    'users.system.edit.exception.lastRemainingSystemManager': 'It\'s not possible to remove permission \'<i>$t(user.table.headers.permission.manage_system_perm)</i>\' from user <bold>{{user}}</bold> because that\'s the only user on the system with that permission!\n\nGrant \'<i>$t(user.table.headers.permission.manage_system_perm)</i>\' permission to other user and then try again.',
    'users.system.batchEdit.success': 'Successfully updated user permissions!',
    'users.system.batchEdit.partial': 'Partial success.\nSome user permissions couldn\'t be updated.',
    'users.system.batchEdit.fail': 'Failed to update user permissions. $t(rq.fail.pleaseTryAgainLater)',

    // categories
    'categories.page.title': 'Categories',
    'categories.add.success': 'Successfully created category \'<bold>{{name}}</bold>\'!',
    'categories.add.fail': 'Failed to create category \'<bold>{{name}}</bold>\'. $t(rq.fail.pleaseTryAgainLater)',
    'categories.update.success': 'Successfully renamed category \'<bold>{{oldName}}</bold>\' to \'<bold>{{newName}}</bold>\' com sucesso!',
    'categories.update.fail': 'Failed to rename category \'<bold>{{oldName}}</bold>\' to \'<bold>{{newName}}</bold>\'. $t(rq.fail.pleaseTryAgainLater)',
    'categories.update.exception.unnamedCategory': 'It\'s not possible to rename category \'<bold>{{name}}</bold>\' as empty!',
    'categories.delete.success': 'Successfully deleted category \'<bold>{{name}}</bold>\'!',
    'categories.delete.fail': 'Failed to delete category \'<bold>{{name}}</bold>\'. $t(rq.fail.pleaseTryAgainLater)',
    'categories.delete.exception.categoryHasChildren': 'It\'s not possible to delete category \'<bold>{{name}}</bold>\' because there are other subcategories associated to it.',
    'categories.delete.exception.categoryHasDocuments': 'It\'s not possible to delete category \'<bold>{{name}}</bold>\'because there are other documents associated to it.',

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
    'import.table.content.validation.info': 'There seems to be a problem with this file. Please remove and add it again before trying to import.',
    'import.page.btns.selectFromDrive': 'Select from Google Drive',
    'import.page.btns.switchAccount': 'Switch Account',
    'import.page.btns.removeSelected': 'Remove Selected',
    'import.page.btns.importSelected': 'Import Selected',
    'import.warningModal.title': '$t(notifications.header.default.warning)',
    'import.warningModal.body.line1': 'There are items in the list for import.',
    'import.warningModal.body.line2': 'Do you want to append the new items to the list or replace them?',
    'import.warningModal.btns.cancel': 'Cancel',
    'import.warningModal.btns.append': 'Append',
    'import.warningModal.btns.replace': 'Replace',
    'import.google.fail': 'Failed to connect to Google. Please, try again later.',
    'import.google.searchDocuments.fail': 'Failed to retrieve some of the documents from Google Drive. $t(rq.fail.pleaseTryAgainLater)',

    // exception messages
    'exception.unauthorized': 'Unauthorized access. Please login again.',
    'exception.resourceNotFound': 'Resource not found in the server.',
}

export default enUS;