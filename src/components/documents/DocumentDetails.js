import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import rq from '../../services/api'
import { AuthContext } from '../../contexts/AuthContext'
import { Button, Col, Form } from 'react-bootstrap'
import { Redirect, Route, Switch, useParams, useRouteMatch } from 'react-router-dom'
import '../../style/documents/DocumentDetails.css'

const DocumentForm = () => {
    const { t } = useTranslation();
    const { docId } = useParams();
    const { user } = useContext(AuthContext);
    const [ redirect, setRedirect ] = useState(null);
    const [ categories, setCategories ] = useState([]);
    const [ validation, setValidation ] = useState({});
    const initialDocumentValues = {
        title: '',
        summary: '',
        fileName: '',
        category: 0,
        content: '',
        date: new Date().toISOString().split('T')[0]
    }
    const [ document, setDocument ] = useState(initialDocumentValues);

    useEffect(() => {
        if (docId) {
            rq(`/documents/${docId}`, { method: 'GET' })
            .then(res => { if (res.ok) return res.json(); else setRedirect('/documents'); })
            .then(doc => { if (doc) setDocument(doc) });
        }
    }, [docId])

    useEffect(() => {
        rq('/categories', { method: 'GET' })
        .then(res => { if (res.ok) return res.json() })
        .then(cats => setCategories(cats.length ? cats : [{ id: 0, name: t('document.form.category.zeroOptions') }]));
    }, [t])

    useEffect(() => { if (redirect) setRedirect(null) }, [redirect])

    const validateField = (name, value, localValidationObj) => {
        localValidationObj = localValidationObj || validation
        var fieldValidation = false;

        switch (name) {
            case 'fileName':
                if (!value.match(/^.*?\.(doc|docx|docm|eml|epub|odf|odt|pdf|rtf|rtx|txt|text)$/g))
                    fieldValidation = 'invalidFileType'
                break
            case 'title':
                if (!value.length)
                    fieldValidation = 'emptyTitle'
                break
            case 'category':
                if (!(value > 0))
                    fieldValidation = 'categoryNotSelected'
                break
            default:
                break
        }

        localValidationObj = { ...localValidationObj, [name]: fieldValidation }
        setValidation(localValidationObj)
        return localValidationObj
    }

    const handleDocChange = e => {
        let name = e.target.name
        let value = e.target.value
        
        if (name === 'uploadFile') {
            if (!e.target.files.length) return
            name = 'fileName'
            value = e.target.files[0].name
        }

        validateField(name, value)
        setDocument({ ...document, [name]: value })
    }

    const handleSubmit = e => {
        e.preventDefault()
        e.stopPropagation()
        
        let validationObj = validation
        Object.entries(document).forEach(i => validationObj = validateField(i[0], i[1], validationObj))
        if (!Object.values(validationObj).every(i => i === false))
            return;

        rq(document.id ? `/documents/${docId}` : '/documents', {
            method: document.id ? 'PATCH' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                ...document, 
                tenant: user.currentDepartment.acronym,
                registeredBy: user.id, 
                registeredAt: new Date().toISOString() 
            })
        }).then(res => { if (res.ok) return res.json() 
        }).then(doc => { if (doc) setRedirect(`/documents/${doc.id}`) });
    }

    const handleDelete = () => {
        rq(`/documents/${docId}`, { method: 'DELETE' })
        .then(res => { 
            if (!res.ok) return
            console.log(`Document '${docId}' deleted`)
            setDocument(initialDocumentValues)
            setValidation({})
            setRedirect('/documents')
        });
    }

    return (
        redirect
        ? <Redirect to={redirect} />
        : <Form id="docForm" noValidate onSubmit={handleSubmit}>
            <h1>{t(`document.form.${docId ? 'edit' : 'add'}.title`)}</h1>
            <Form.Row>
                <Form.Group as={Col} controlId="docForm.title">
                    <Form.Label>{t('document.form.title')}</Form.Label>
                    <Form.Control 
                        type="text" name="title" required 
                        onChange={handleDocChange} 
                        isInvalid={validation.title}
                        value={document.title} />
                        <Form.Control.Feedback type="invalid">{t(`document.form.validation.${validation.title}`)}</Form.Control.Feedback>
                </Form.Group>
            </Form.Row>
            <Form.Row>
                <Form.Group as={Col} controlId="docForm.summary">
                    <Form.Label>{t('document.form.summary')}</Form.Label>
                    <Form.Control as="textarea" rows={3} name="summary" onChange={handleDocChange} value={document.summary}/>
                    <Form.Text className="text-muted">
                        {t('document.form.summary.mutedText')}
                    </Form.Text>
                </Form.Group>
            </Form.Row>
            <Form.Row>
                <Form.Group as={Col} controlId="docForm.category">
                    <Form.Label>{t('document.form.category')}</Form.Label>
                    <Form.Control as="select" name="category" required 
                        onChange={handleDocChange} 
                        isInvalid={validation.category}
                        value={document.category}>
                        <option style={{display: 'none'}}>{t('document.form.category.choose')}</option>
                        {categories.map(item => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                        ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">{t(`document.form.validation.${validation.category}`)}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} controlId="docForm.date">
                    <Form.Label>{t('document.form.date')}</Form.Label>
                    <Form.Control type="date" name="date" onChange={handleDocChange} value={document.date}/>
                </Form.Group>
            </Form.Row>
            <Form.Row>
                <Form.Group as={Col} controlId="docForm.fileName">
                    <Form.Label>{t('document.form.file')}</Form.Label>
                    <Form.File id="doc" custom>
                        <Form.File.Input 
                            name="uploadFile" onChange={handleDocChange} required
                            isInvalid={validation.fileName} />
                        <Form.File.Label data-browse={t('document.form.file.choose')}>
                            {document.fileName || t('document.form.file.placeholder')}
                        </Form.File.Label>
                        <Form.Control.Feedback type="invalid">{t(`document.form.validation.${validation.fileName}`)}</Form.Control.Feedback>
                    </Form.File>
                </Form.Group>
            </Form.Row>
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
