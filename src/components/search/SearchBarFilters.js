import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { UserContext } from '../../contexts/UserContext'
import rq from '../../services/api'
import DatePicker from '../Utils/DatePicker'
import { Form, InputGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

export const TextInputFilter = ({ disabled, value, onChange, onSubmit }) =>
    <InputGroup>
        <InputGroup.Text>
            <FontAwesomeIcon icon={faSearch} />
        </InputGroup.Text>
        <Form.Control
            id="textInput"
            disabled={disabled}
            onChange={e => onChange('text', e.target.value)}
            onKeyPress={e => !disabled && e.code === 'Enter' ? onSubmit(e) : null}
            value={value}
            type="text"
        />
    </InputGroup>

export const CategoryFilter = ({ label, onChange, value, placeholder, unselectOptionLabel }) => {
    const { t } = useTranslation();
    const [categories, setCategories] = useState([]);
    const { department } = useContext(UserContext);

    useEffect(() => {
        rq('/categories', { method: 'GET' })
            .then(res => { if (res.ok) return res.json() })
            .then(cats => { setCategories(cats); onChange('category', '')});
    }, [department]);

    return (
        <div className="custom-input-group category-filter">
            <Form.Label>{label}</Form.Label>
            <Form.Select
                name="category"
                onChange={e => onChange('category', e.target.value)}
                value={value}>
                <option style={{ display: 'none' }}>{placeholder}</option>
                
                {categories[0]?.id === 0 ? <></> : <option value="-1">-- {unselectOptionLabel} --</option>}
                
                {categories.length
                        ? categories.sort((a, b) => a.fullName.localeCompare(b.fullName)).map(item => (
                            <option key={item.id} value={item.id}>{item.fullName}</option>
                        ))
                        : <option key={0} value={0}>{t('document.form.category.zeroOptions')}</option>
                }
            </Form.Select>
        </div>
    )
}

export const MinMaxDateFilter = ({ labelFromDate, labelUntilDate, onChange, minDateValue, maxDateValue }) =>
    <div className="custom-input-group date-filter">
        <Form.Label>{labelFromDate}</Form.Label>
        <DatePicker name="minDate" required
            onChange={onChange}
            max={maxDateValue}
            value={minDateValue}
        />
        <Form.Label>{labelUntilDate}</Form.Label>
        <DatePicker name="maxDate" required
            onChange={onChange}
            min={minDateValue}
            value={maxDateValue}
        />
    </div>

export const UserDocumentsFilter = ({ label, value, onClick }) =>
    <div className="custom-input-group user-filter">
        <Form.Check type="checkbox" name="myDocuments"
            id="filterMyDocuments"
            onClick={e => onClick('myDocuments', e.target.value)}
            label={label}
            value={value}
        />
    </div>