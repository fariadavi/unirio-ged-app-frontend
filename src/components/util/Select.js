import React from 'react'
import { Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons'
import '../../style/utils/Select.css'

const Select = ({ className = '', disabled = false, label, name, placeholder, value, onChange, options, noOptionsLabel, textProperty, idProperty = 'id', required, isValid, isInvalid, children, size }) =>
    <div className={`select-wrapper ${className}`}>

        {!!label && <Form.Label>{label}</Form.Label>}

        <Form.Control as="select" custom
            disabled={disabled}
            required={required}
            name={name}
            onChange={e => onChange(name, e.target.value)}
            isValid={isValid}
            isInvalid={isInvalid}
            value={value}
            size={size}>
            <option key={0} style={{ display: options.length ? 'none' : '' }}>
                {options.length ? placeholder : noOptionsLabel}
            </option>
            {options.length
                && options.sort((a, b) =>
                    textProperty
                        ? a[textProperty].localeCompare(b[textProperty])
                        : a.localeCompare(b)
                ).map((item, index) =>
                    <option
                        key={idProperty ? item[idProperty] : index}
                        value={idProperty ? item[idProperty] : index + 1}
                    >
                        {textProperty ? item[textProperty] : item}
                    </option>
                )
            }
        </Form.Control>

        <input type="checkbox" className="select-has-value" checked={!!value} readOnly />

        <span className="clear-input" onClick={() => onChange(name, 0)}>
            <FontAwesomeIcon icon={faTimesCircle} />
        </span>

        {children}

    </div>

export default Select;