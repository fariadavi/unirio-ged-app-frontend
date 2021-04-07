import React, { useContext, useEffect, useState } from 'react'
import rq from '../../services/api'
import { AuthContext } from '../../contexts/AuthContext'
import { Button, Col, Form } from 'react-bootstrap'
import { Redirect, Route, Switch, useParams, useRouteMatch } from 'react-router-dom'
import '../../style/documents/DocumentDetails.css'

const DocumentForm = () => {
    const initialDocumentValues = {
        title: '',
        summary: '',
        fileName: '',
        category: 0,
        content: '',
        date: new Date().toISOString().split('T')[0]
    }

    const { docId } = useParams();
    const { user } = useContext(AuthContext);
    const [ redirect, setRedirect ] = useState(null);
    const [ categories, setCategories ] = useState([]);
    const [ validation, setValidation ] = useState({});
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
        .then(cats => setCategories(cats.length ? cats : [{ id: 0, name: 'No categories on current department' }]));
    }, [])

    useEffect(() => { if (redirect) setRedirect(null) }, [redirect])

    const validateField = (name, value, localValidationObj) => {
        localValidationObj = localValidationObj || validation
        var fieldValidation = false;

        switch (name) {
            case 'fileName':
                if (!value.match(/^.*?\.(doc|docx|docm|eml|epub|odf|odt|pdf|rtf|rtx|txt|text)$/g))
                    fieldValidation = 'File selected does not have a valid type'
                break
            case 'title':
                if (!value.length)
                    fieldValidation = 'Title is required'
                break
            case 'category':
                if (!(value > 0))
                    fieldValidation = 'You must select a category'
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
            setRedirect('/documents')
        });
    }

    return (
        redirect
        ? <Redirect to={redirect} />
        : <Form noValidate onSubmit={handleSubmit}>
            <h1>{docId ? 'EDIT DOCUMENT' : 'ADD NEW DOCUMENT'}</h1>
            <Form.Row>
                <Form.Group as={Col} controlId="docForm.fileName">
                    <Form.Label>File</Form.Label>
                    <Form.File id="doc" custom>
                        <Form.File.Input 
                            name="uploadFile" onChange={handleDocChange} required
                            isInvalid={validation.fileName} />
                        <Form.File.Label data-browse="Choose file">
                            {document.fileName || 'No file selected'}
                        </Form.File.Label>
                        <Form.Control.Feedback type="invalid">{validation.fileName}</Form.Control.Feedback>
                    </Form.File>
                </Form.Group>
            </Form.Row>
            <div id="docFormBody" className={ document.id || (document.fileName && !validation.fileName) ? 'active' : '' }>
                <Form.Row>
                    <Form.Group as={Col} controlId="docForm.title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control 
                            type="text" name="title" required 
                            onChange={handleDocChange} 
                            isInvalid={validation.title}
                            value={document.title} />
                            <Form.Control.Feedback type="invalid">{validation.title}</Form.Control.Feedback>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} controlId="docForm.category">
                        <Form.Label>Category</Form.Label>
                        <Form.Control as="select" name="category" required 
                            onChange={handleDocChange} 
                            isInvalid={validation.category}
                            value={document.category}>
                            <option style={{display: 'none'}}>Choose...</option>
                            {categories.map(item => (
                                <option key={item.id} value={item.id}>{item.name}</option>
                            ))}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">{validation.category}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} controlId="docForm.date">
                        <Form.Label>Document Date</Form.Label>
                        <Form.Control type="date" name="date" onChange={handleDocChange} value={document.date}/>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} controlId="docForm.summary">
                        <Form.Label>Summary</Form.Label>
                        <Form.Control as="textarea" rows={3} name="summary" onChange={handleDocChange} value={document.summary}/>
                        <Form.Text className="text-muted">
                            A brief description of the document being uploaded.
                        </Form.Text>
                    </Form.Group>
                </Form.Row>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="danger" onClick={handleDelete} style={{ display: docId ? 'block' : 'none' }}>
                        Delete
                    </Button>
                    <Button variant="primary" type="submit" style={{ marginLeft: '6px' }} disabled={!Object.values(validation).every(i => i === false)} >
                        { docId ? 'Update' : 'Submit' }
                    </Button>
                </div>
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
