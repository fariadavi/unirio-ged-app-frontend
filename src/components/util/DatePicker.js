import React from 'react'
import { Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons'
import '../../style/utils/DatePicker.css'

const DatePicker = ({ className = '', disabled = false, size, name, label, min, max, value, onChange, isInvalid, validationMessage }) =>
    <div className={`custom-date-picker ${className}`}>
        {!!label && <Form.Label>{label}</Form.Label>}
        <div className="date-wrapper">
            <Form.Control type="date" name={name} required
                disabled={disabled}
                onChange={e => onChange(name, e.target.value)}
                min={min}
                max={max}
                size={size}
                value={value}
                isInvalid={isInvalid}
            />
            <span className="clear-input" onClick={() => onChange(name, '')}>
                <FontAwesomeIcon icon={faTimesCircle} />
            </span>

            {isInvalid
                ? <Form.Control.Feedback type="invalid">
                    {validationMessage}
                </Form.Control.Feedback>
                : ''}
        </div>
    </div>

export default DatePicker;