import React from 'react'
import { Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons'

export default function DatePicker({ name, min, max, value, onChange, onClear }) {
    return (
        <div className="dateFilter">
            <Form.Control type="date" name={name} required
                onChange={onChange}
                min={min}
                max={max}
                value={value}
            />
            <span className="clear-input" onClick={onClear}>
                <FontAwesomeIcon icon={faTimesCircle} />
            </span>
        </div>
    )
}