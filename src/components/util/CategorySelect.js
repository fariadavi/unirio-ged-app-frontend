import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { UserContext } from '../../contexts/UserContext'
import rq from '../../services/api'
import { Form } from 'react-bootstrap'
import Select from './Select'

const CategorySelect = ({ className, label, onChange, isValid, isInvalid, validationMessage, value }) => {
    const { t } = useTranslation();
    const { department } = useContext(UserContext);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        rq('/categories', { method: 'GET' })
            .then(res => { if (res.ok) return res.json() })
            .then(cats => setCategories(cats));
    }, [department]);

    return <Select
        className={className}
        label={label}
        name="category"
        isValid={isValid}
        isInvalid={isInvalid}
        onChange={onChange}
        options={categories}
        placeholder={t('document.form.category.choose')}
        noOptionsLabel={t('document.form.category.zeroOptions')}
        textProperty="fullName"
        value={value}
    >
        {isInvalid
            ? <Form.Control.Feedback type="invalid">
                {validationMessage}
            </Form.Control.Feedback>
            : ''}
    </Select>
}

export default CategorySelect;