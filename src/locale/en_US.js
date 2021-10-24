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
    'navbar.management': 'Management',
    'navbar.management.category': '$t(category_plural)',
    'navbar.management.department': '$t(department_plural)',
    'navbar.management.users': '$t(user_plural)',
    'navbar.language': 'Language',
    'navbar.language.en-US.shortName': 'English',
    'navbar.language.en-US.fullName': 'American English',
    'navbar.language.pt-BR.shortName': 'Portuguese',
    'navbar.language.pt-BR.fullName': 'Brazilian Portuguese',
    'navbar.department': '$t(department)',
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

    // user table
    'user.table.title': 'Manage Users',
    'user.table.headers.username': '$t(user.name)',
    'user.table.headers.email': '$t(user.email)',
    'user.table.headers.permission.1': 'Search documents',
    'user.table.headers.permission.2': 'Add documents',
    'user.table.headers.permission.3': 'Edit other users\' documents',
    'user.table.headers.permission.4': 'Delete other users\' documents',
    'user.table.headers.permission.5': 'Invite users',
    'user.table.headers.permission.6': 'Manage user permissions',
    'user.table.headers.permission.7': 'Manage categories',
    'user.table.filters.text.username': 'Filter by user name',
    'user.table.filters.text.email': 'Filter by email',
    'user.table.filters.boolean.y': '$t(yes)',
    'user.table.filters.boolean.n': '$t(no)',

    // ?
    'user.invite': 'Invite new user',
}

export default enUS;