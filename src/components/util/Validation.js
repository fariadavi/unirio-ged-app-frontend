const validateFile = file =>
    !file
        ? 'fileRequired'
        : !file.size
            ? 'emptyContentFile'
            : !file.name.match(/^.*?\.(doc|docx|docm|eml|epub|odf|odt|pdf|rtf|rtx|txt|text)$/gi)
                ? 'invalidFileType'
                : ''

const validateTitle = title =>
    !title.length
        ? 'titleRequired'
        : ''

const validateCategory = categoryId =>
    categoryId <= 0
        ? 'categoryRequired'
        : ''

const validateEmail = email =>
    !email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g)
        ? 'invalidEmailFormat'
        : !['@edu.unirio.br', '@uniriotec.br', '@unirio.br'].some(domain => email.includes(domain)) //TODO read valid domains from config file
            ? 'invalidDomain'
            : ''

const validateDeptAcronym = acronym =>
    acronym.includes(' ')
        ? 'cantContainWhitespaces'
        : acronym.length > 5
            ? 'acronymMaxLength'
            : ''

export const validateField = (field, value) => {
    switch (field) {
        case 'file':
            return validateFile(value);
        case 'title':
            return validateTitle(value);
        case 'category':
        case 'categoryId':
            return validateCategory(value);
        case 'userPermissions.email':
            return validateEmail(value);
        case 'departments.acronym':
            return validateDeptAcronym(value);
        default:
            return '';
    }
}

export const validateObject = (document, setValidationState) => {
    let validationObj = {};

    Object.entries(document).forEach(([field, value]) =>
        validationObj[field] = validateField(field, value)
    );

    if (setValidationState)
        setValidationState(validationObj);

    return Object.values(validationObj).every(i => !i);
}