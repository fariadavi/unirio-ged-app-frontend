import React from 'react'
import DatePicker from '../util/DatePicker'
import CategorySelect from '../util/CategorySelect'
import { Form, InputGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

export const TextInputFilter = ({ disabled, value, onChange, onSubmit }) =>
    <InputGroup>
        <InputGroup.Prepend>
            <InputGroup.Text id="inputGroupPrepend">
                <FontAwesomeIcon icon={faSearch} />
            </InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control
            id="textInput"
            disabled={disabled}
            onChange={e => onChange('text', e.target.value)}
            onKeyPress={e => !disabled && e.code === 'Enter' ? onSubmit(e) : null}
            value={value}
            type="text"
        />
    </InputGroup>

export const CategoryFilter = ({ label, onChange, value }) => {
    return (
        <CategorySelect
            className="custom-input-group category-filter"
            label={label}
            onChange={onChange}
            value={value}
        />
    )
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