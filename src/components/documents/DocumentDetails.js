import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import rq from '../../services/api'
import Select from '../Utils/Select'
import DatePicker from '../Utils/DatePicker'
import { getStatusBadge } from '../Utils/StatusBadge'
import { AuthContext } from '../../contexts/AuthContext'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { Redirect, Route, Switch, useParams, useRouteMatch } from 'react-router-dom'
import '../../style/documents/DocumentDetails.css'

const CategorySelect = ({ label, placeholder, onChange, value, required, isInvalid, children }) => {
    const [categories, setCategories] = useState([]);
    const { user } = useContext(AuthContext);
    const department = user?.currentDepartment;

    useEffect(() => {
        rq('/categories', { method: 'GET' })
            .then(res => { if (res.ok) return res.json() })
            .then(cats => setCategories(cats));
    }, [department]);

    return <Select
        label={label}
        placeholder={placeholder}
        required={required}
        isInvalid={isInvalid}
        name="category"
        onChange={onChange}
        options={categories}
        value={value}
        textProperty="fullName"
    />
}

const DocumentForm = () => {
    const { t } = useTranslation();
    const { docId } = useParams();
    const { user } = useContext(AuthContext);
    const [ redirect, setRedirect ] = useState(null);
    // const [ categories, setCategories ] = useState([]);
    const [ validation, setValidation ] = useState({});
    const initialDocumentValues = useMemo(() => { return {
        title: '',
        summary: '',
        category: 0,
        date: new Date().toISOString().split('T')[0],
        file: undefined
    }}, []);
    const [ document, setDocument ] = useState(initialDocumentValues);

    useEffect(() => { if (redirect) setRedirect(null) }, [redirect])

    // useEffect(() => {
    //     rq('/categories', { method: 'GET' })
    //     .then(res => { if (res.ok) return res.json() })
    //     .then(cats => setCategories(cats?.length ? cats : [{ id: 0, fullName: t('document.form.category.zeroOptions') }]));
    // }, [t])

    const validateField = (name, value, localValidationObj) => {
        localValidationObj = localValidationObj || validation
        var fieldValidation = false;

        switch (name) {
            case 'file':
                if (!value)
                    fieldValidation = 'fileRequired'
                else if (!value.size)
                    fieldValidation = 'emptyContentFile'
                else if (!value.name.match(/^.*?\.(doc|docx|docm|eml|epub|odf|odt|pdf|rtf|rtx|txt|text)$/gi))
                    fieldValidation = 'invalidFileType'
                break
            case 'title':
                if (!value.length)
                    fieldValidation = 'titleRequired'
                break
            case 'category':
                if (value <= 0)
                    fieldValidation = 'categoryRequired'
                break
            default:
                break
        }

        localValidationObj = { ...localValidationObj, [name]: fieldValidation }
        setValidation(localValidationObj)
        return localValidationObj
    }

    const handleDocChange = e => {
        let doc = document
        let name = e.target.name
        let value = e.target.value
        let localValidationObj = undefined

        if (name === 'uploadFile') {
            if (!e.target.files.length) return
            name = 'file'
            value = e.target.files[0]

            if (!doc.title) {
                let docName = e.target.files[0].name.replace(/\.\w+?$/g, '')
                doc = { ...doc, title: docName }
                localValidationObj = validateField('title', docName)
            }
        }

        validateField(name, value, localValidationObj)
        setDocument({ ...doc, [name]: value })
    }

    const handleDocChange2 = (key, value) => {
        if (key === 'category' && value === '-1')
            value = 0;

        setDocument({ ...document, [key]: value });
    };

    const handleSubmit = e => {
        e.preventDefault()
        e.stopPropagation()
        
        let validationObj = validation
        Object.entries(document).forEach(i => validationObj = validateField(i[0], i[1], validationObj))
        if (!Object.values(validationObj).every(i => i === false))
            return;

        let { file, ...doc } = document;
        doc = { 
            ...doc, 
            tenant: user.currentDepartment.acronym.toLowerCase(),
            registeredBy: user.id, 
            registeredAt: new Date().toISOString() 
        };

        if (document.id && document.file.name === document.fileName && document.file.size === -1)
            file = undefined

        submitDocumentForm(doc, file, !!document.id);
    }

    const handleDelete = () => {
        rq(`/documents/${docId}`, { method: 'DELETE' })
        .then(res => { 
            if (!res.ok) return
            window.alert(`Document '${docId}' deleted`)
            setRedirect('/documents')
        });
    }

    const submitDocumentForm = (docInfo, file, isEdit) => {
        var formData = new FormData();
        formData.append('file', file);
        formData.append('document', new Blob([JSON.stringify(docInfo)], { type: 'application/json' }));

        rq(`/documents${isEdit ? `/${docId}` : ''}`, {
            method: isEdit ? 'PATCH' : 'POST',
            headers: { 'Accept': 'application/json' },
            body: formData
        }).then(res => { if (res.ok) return res.json() 
        }).then(doc => { if (doc) setRedirect(`/documents/${doc.id}`) });
    }

    return (
        redirect
        ? <Redirect to={redirect} />
        : <Form id="docForm" noValidate onSubmit={handleSubmit}>
            <h1>{t(`document.form.${docId ? 'edit' : 'add'}.title`)}</h1>
            <Row>
                <Form.Group as={Col} controlId="docForm.fileName">
                    <Form.Label>{t('document.form.file')}</Form.Label>
                    <div className="custom custom-file">
                        <Form.Control 
                            type="file" 
                            required
                            id="docFileInput"
                            name="uploadFile"
                            onChange={handleDocChange}
                            isInvalid={validation['file']}
                        />
                        <Form.Control.Feedback type="invalid">{t(`document.form.validation.${validation['file']}`)}</Form.Control.Feedback>
                    </div>
                </Form.Group>
            </Row>
            <Row>
                <Form.Group as={Col} controlId="docForm.title">
                    <Form.Label>{t('document.title')}</Form.Label>
                    <Form.Control 
                        type="text" name="title" required 
                        onChange={handleDocChange} 
                        isInvalid={validation['title']}
                        value={document.title} />
                        <Form.Control.Feedback type="invalid">{t(`document.form.validation.${validation['title']}`)}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} xs={2} controlId="docForm.status" style={{ display: document.id ? 'block' : 'none' }}>
                    <Form.Label>{t('document.status')}</Form.Label>
                    <Form.Text as="p">
                        {getStatusBadge(document['status'])}
                    </Form.Text>
                </Form.Group>
            </Row>
            <Row>
                <Form.Group as={Col} controlId="docForm.summary">
                    <Form.Label>{t('document.summary')}</Form.Label>
                    <Form.Control as="textarea" rows={5} name="summary" onChange={handleDocChange} value={document.summary}/>
                    <Form.Text className="text-muted">
                        {t('document.form.summary.mutedText')}
                    </Form.Text>
                </Form.Group>
            </Row>
            <Row>
                <Form.Group as={Col} controlId="docForm.category">
                    <Form.Label>{t('document.category')}</Form.Label>
                    <CategorySelect 
                        placeholder={t('document.form.category.choose')}
                        onChange={handleDocChange2} 
                        isInvalid={validation['category']}
                        value={document.category}
                    >
                        <Form.Control.Feedback type="invalid">
                            {t(`document.form.validation.${validation['category']}`)}
                        </Form.Control.Feedback>
                    </CategorySelect>
                </Form.Group>
                <Form.Group as={Col} controlId="docForm.date">
                    <Form.Label>{t('document.date')}</Form.Label>
                    <DatePicker name="date" onChange={handleDocChange} value={document.date} onClear={() => handleDocChange({ target: { name: 'date', value: '' } })} />
                </Form.Group>
            </Row>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="danger" onClick={handleDelete} style={{ display: docId ? 'block' : 'none' }}>
                    {t('document.form.deleteButton')}
                </Button>
                <Button variant="primary" type="submit" style={{ marginLeft: '6px' }} disabled={!Object.values(validation).every(i => i === false)} >
                    {t(`document.form.${docId ? 'updateButton' : 'submitButton'}`)}
                </Button>
            </div>
        </Form>
    )
}

export default function DocumentDetails() {
    let match = useRouteMatch();

    return (
        <Switch>
            <Route path={`${match.path}/:docId`} component={DocumentForm} />
            <Route path={match.path} component={DocumentForm} />
        </Switch>
    )
}
