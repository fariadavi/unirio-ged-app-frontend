import React from 'react'
import DatePicker from '../util/DatePicker'
import CategorySelect from '../util/CategorySelect'
import StatusSelect from '../util/StatusSelect'
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

export const CategoryFilter = ({ disabled = false, label, onChange, value }) =>
    <CategorySelect
        className="custom-input-group category-filter"
        disabled={disabled}
        label={label}
        onChange={onChange}
        value={value}
    />

export const MinMaxDateFilter = ({ disabled = false, labelFromDate, labelUntilDate, onChange, minDateValue, maxDateValue }) =>
    <div className="custom-input-group date-filter">
        <DatePicker name="minDate"
            disabled={disabled}
            label={labelFromDate}
            onChange={onChange}
            max={maxDateValue}
            value={minDateValue}
        />
        <DatePicker name="maxDate"
            disabled={disabled}
            label={labelUntilDate}
            onChange={onChange}
            min={minDateValue}
            value={maxDateValue}
        />
    </div>

export const UserDocumentsFilter = ({ disabled = false, label, value, onClick }) =>
    <div className="custom-input-group user-filter">
        <Form.Check type="checkbox" name="myDocuments" custom
            id="filterMyDocuments"
            disabled={disabled}
            onClick={e => onClick('myDocuments', e.target.value)}
            label={label}
            value={value}
        />
    </div>

export const StatusFilter = ({ disabled = false, label, onChange, value }) =>
    <StatusSelect
        className="custom-input-group status-filter"
        disabled={disabled}
        label={label}
        onChange={onChange}
        value={value}
    />