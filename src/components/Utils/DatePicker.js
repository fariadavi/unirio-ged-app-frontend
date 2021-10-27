import React from 'react'
import { FormControl } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons'

export default function DatePicker({ name, min, max, value, onChange }) {
    return (
        <div className="dateFilter">
            <FormControl type="date" name={name} required
                onChange={e => onChange(name, e.target.value)}
                min={min}
                max={max}
                value={value}
            />
            <span className="clear-input" onClick={() => onChange(name, '')}>
                <FontAwesomeIcon icon={faTimesCircle} />
            </span>
        </div>
    )
}