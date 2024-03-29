import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { UserContext } from '../../contexts/UserContext'
import { NetworkContext } from '../../contexts/NetworkContext'
import { Form } from 'react-bootstrap'
import Select from './Select'

const CategorySelect = ({ categories = undefined, disabled = false, className, label, name = 'category', onChange, isValid, isInvalid, size, validationMessage, value }) => {
    const { t } = useTranslation();
    const { department, userLoading } = useContext(UserContext);
    const { rq } = useContext(NetworkContext);
    const [cats, setCats] = useState([]);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => { if (userLoading) setLoading(true) }, [userLoading]);

    useEffect(() => {
        setLoading(true);

        if (!categories) {
            rq('/categories?fullName=true', { method: 'GET' })
                .then(res => { if (res.ok) return res.json() })
                .then(c => { setCats(c); setLoading(false); });
        } else {
            setCats(categories);
            setLoading(false);
        }
    }, [rq, categories, department]);

    return <Select
        className={className}
        disabled={disabled}
        label={label}
        name={name}
        isValid={isValid}
        isInvalid={isInvalid}
        onChange={onChange}
        options={cats}
        placeholder={t('document.form.category.choose')}
        noOptionsLabel={t('document.form.category.zeroOptions')}
        textProperty="fullName"
        value={value}
        size={size}
        isLoading={isLoading}
    >
        {isInvalid
            ? <Form.Control.Feedback type="invalid">
                {validationMessage}
            </Form.Control.Feedback>
            : ''}
    </Select>
}

export default CategorySelect;