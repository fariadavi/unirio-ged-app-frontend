import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../contexts/UserContext'
import rq from '../../services/api'
import DatePicker from '../Utils/DatePicker'
import Select from '../Utils/Select'
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

export const CategoryFilter = ({ label, onChange, value, placeholder }) => {
    const [categories, setCategories] = useState([]);
    const { department } = useContext(UserContext);

    useEffect(() => {
        rq('/categories', { method: 'GET' })
            .then(res => { if (res.ok) return res.json() })
            .then(cats => setCategories(cats));
    }, [department]);

    return <Select
        label={label}
        className="custom-input-group category-filter"
        placeholder={placeholder}
        name="category"
        onChange={onChange}
        options={categories}
        value={value}
        textProperty="fullName"
    />
}

export const MinMaxDateFilter = ({ labelFromDate, labelUntilDate, onChange, minDateValue, maxDateValue }) =>
    <div className="custom-input-group date-filter">
        <DatePicker name="minDate"
            label={labelFromDate}
            onChange={onChange}
            max={maxDateValue}
            value={minDateValue}
        />
        <DatePicker name="maxDate"
            label={labelUntilDate}
            onChange={onChange}
            min={minDateValue}
            value={maxDateValue}
        />
    </div>

export const UserDocumentsFilter = ({ label, value, onClick }) =>
    <div className="custom-input-group user-filter">
        <Form.Check type="checkbox" name="myDocuments" custom
            id="filterMyDocuments"
            onClick={e => onClick('myDocuments', e.target.value)}
            label={label}
            value={value}
        />
    </div>