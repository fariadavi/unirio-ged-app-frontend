import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { UserContext } from '../../contexts/UserContext'
import rq from '../../services/api'
import DocumentImport from './DocumentImport'
import DatePicker from '../util/DatePicker'
import CategorySelect from '../util/CategorySelect'
import PageNotFound from '../invalid/PageNotFound';
import StatusBadge from '../util/StatusBadge'
import { Button, Col, Form } from 'react-bootstrap'
import { Redirect, Route, Switch, useParams, useRouteMatch } from 'react-router-dom'
import { validateField, validateObject } from '../util/Validation.js'
import '../../style/documents/DocumentDetails.css'

const DocumentForm = () => {
    const { t } = useTranslation();
    const { docId } = useParams();
    const { user, department, checkPermission } = useContext(UserContext);
    const [redirect, setRedirect] = useState(null);
    const [validation, setValidation] = useState({});
    const initialDocumentValues = useMemo(() => ({
        title: '',
        summary: '',
        categoryId: 0,
        date: new Date().toISOString().split('T')[0],
        file: undefined
    }), []);
    const [document, setDocument] = useState(initialDocumentValues);

    useEffect(() => { if (redirect) setRedirect(null) }, [redirect]);

    useEffect(() => setDocument(doc => ({ ...doc, categoryId: 0 })), [department]);

    useEffect(() => {
        if (docId && docId !== document.id) {
            rq(`/documents/${docId}`, { method: 'GET' })
                .then(res => { if (res.ok) return res.json(); else setValidation({ invalidDocument: true }); })
                .then(doc => { if (doc) setDocument({ ...doc, file: { name: doc.fileName, size: -1 } }) });

        } else if (!docId && document.id) {
            setDocument(initialDocumentValues);
            setValidation({});
        }
    }, [docId, document.id, initialDocumentValues]);

    const setDocumentValue = (key, value) => {
        setValidation({ ...validation, [key]: validateField(key, value) });
        setDocument({ ...document, [key]: value });
    }

    const handleDocChange = e => {
        let doc = document
        let val = validation

        let name = e.target.name
        let value = e.target.value

        if (name === 'uploadFile') {
            let files = e.target.files;

            if (!files.length) return
            name = 'file';
            value = files[0];

            if (!document['title']) {
                let docName = files[0].name.replace(/\.\w+?$/g, '');
                doc = { ...doc, title: docName };
                val = { ...val, title: validateField('title', docName) };
            }
        }

        setValidation({ ...val, [name]: validateField(name, value) });
        setDocument({ ...doc, [name]: value });
    }

    const handleSubmit = e => {
        e.preventDefault()
        e.stopPropagation()

        if (validateObject(document, setValidation))
            submitDocumentForm();
    }

    const submitDocumentForm = () => {
        let { file, ...doc } = document;
        doc = {
            ...doc,
            tenant: department.acronym.toLowerCase(),
            registeredBy: user.id,
            registeredAt: new Date().toISOString()
        };

        if (document['id'] && document['file']['name'] === document['fileName'] && document['file']['size'] === -1)
            file = undefined;

        updateDocument(doc, file, !!document['id']);
    }

    const updateDocument = (docInfo, file, isEdit) => {
        var formData = new FormData();
        formData.append('file', file);
        formData.append('document', new Blob([JSON.stringify(docInfo)], { type: 'application/json' }));

        rq(`/documents${isEdit ? `/${docId}` : ''}`, {
            method: isEdit ? 'PATCH' : 'POST',
            headers: { 'Accept': 'application/json' },
            body: formData
        }).then(res => {
            if (res.ok) return res.json()
        }).then(doc => { if (doc) setRedirect(`/documents/${doc.id}`) });
    }

    const handleDelete = () => {
        rq(`/documents/${docId}`, { method: 'DELETE' })
            .then(res => {
                if (!res.ok) return;
                window.alert(`Document '${docId}' deleted`);
                setRedirect(checkPermission('ADD_DOCS') ? '/documents/new' : '/');
            });
    }

    return (
        redirect
            ? <Redirect to={redirect} />
            : (docId && document?.tenant?.toLowerCase() !== department?.acronym?.toLowerCase()) || (docId && validation.invalidDocument) ||
                (!docId && !checkPermission('ADD_DOCS')) || (docId && document.registeredById !== user.id && !checkPermission('EDIT_DOCS_OTHERS'))
                ? <PageNotFound />
                : <div className="document-details-page">
                    <Form className="document-form" noValidate onSubmit={handleSubmit}>

                        <h1>{t(`document.form.${docId ? 'edit' : 'add'}.title`)}</h1>

                        <Form.Row>
                            <Form.Group as={Col} controlId="docForm.fileName">
                                <Form.Label>{t('document.form.file')}</Form.Label>

                                <Form.File id="doc" custom>
                                    <Form.File.Input
                                        name="uploadFile" required
                                        onChange={handleDocChange}
                                        isInvalid={validation['file']} />

                                    <Form.File.Label data-browse={t('document.form.file.choose')}>
                                        {document.file?.name || t('document.form.file.placeholder')}
                                    </Form.File.Label>

                                    <Form.Control.Feedback type="invalid">
                                        {t(`document.form.validation.${validation['file']}`)}
                                    </Form.Control.Feedback>
                                </Form.File>
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group as={Col} controlId="docForm.title">
                                <Form.Label>{t('document.title')}</Form.Label>

                                <Form.Control
                                    type="text" name="title" required
                                    onChange={handleDocChange}
                                    isInvalid={validation['title']}
                                    value={document['title']} />

                                <Form.Control.Feedback type="invalid">
                                    {t(`document.form.validation.${validation['title']}`)}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group as={Col} xs={2} controlId="docForm.status"
                                style={{ display: document['id'] ? 'block' : 'none' }}>
                                <Form.Label>{t('document.status')}</Form.Label>

                                <Form.Text as="p">
                                    <StatusBadge status={document['status']} />
                                </Form.Text>
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group as={Col} controlId="docForm.summary">
                                <Form.Label>{t('document.summary')}</Form.Label>

                                <Form.Control
                                    as="textarea" name="summary" rows={5}
                                    onChange={handleDocChange}
                                    value={document['summary']}
                                />

                                <Form.Text className="text-muted">
                                    {t('document.form.summary.mutedText')}
                                </Form.Text>
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group as={Col} controlId="docForm.category">
                                <Form.Label>{t('document.category')}</Form.Label>

                                <CategorySelect
                                    name='categoryId'
                                    onChange={setDocumentValue}
                                    isInvalid={validation['categoryId']}
                                    validationMessage={t(`document.form.validation.${validation['categoryId']}`)}
                                    value={document['categoryId']}
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="docForm.date">
                                <Form.Label>{t('document.date')}</Form.Label>

                                <DatePicker name="date"
                                    onChange={setDocumentValue}
                                    value={document['date']}
                                />
                            </Form.Group>
                        </Form.Row>

                        <div className="buttons">
                            <Button
                                variant="danger"
                                onClick={handleDelete}
                                style={{ display: docId ? 'block' : 'none' }}
                            >
                                {t('document.form.deleteButton')}
                            </Button>

                            <Button
                                className="border-color-blue bg-color-blue"
                                variant="primary"
                                type="submit"
                            >
                                {t(`document.form.${docId ? 'updateButton' : 'submitButton'}`)}
                            </Button>
                        </div>
                    </Form>
                </div>
    )
}

export default function DocumentDetails() {
    let match = useRouteMatch();

    return (
        <Switch>
            <Route path={`${match.path}/new`} component={DocumentForm} />
            <Route path={`${match.path}/import`} component={DocumentImport} />
            <Route path={`${match.path}/:docId`} component={DocumentForm} />
        </Switch>
    )
}
