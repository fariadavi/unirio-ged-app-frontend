import React from 'react'
import { useTranslation } from 'react-i18next'
import { Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons'
import '../../style/utils/Select.css'

const Select = ({ className = '', disabled = false, label, name, placeholder, value, onChange, options = [], noOptionsLabel, textProperty, idProperty = 'id', required, isValid, isInvalid, children, size, isLoading = false }) => {
    const { t } = useTranslation();

    return <div className={`select-wrapper ${className}`}>

        {!!label && <Form.Label>{label}</Form.Label>}

        <div className="select-inner-wrapper">
            <Form.Control as="select" custom
                disabled={disabled}
                required={required}
                name={name}
                onChange={e => onChange(name, e.target.value)}
                isValid={isValid}
                isInvalid={isInvalid}
                value={value}
                size={size}
                style={isLoading ? { paddingLeft: '2.5rem' } : {}}>
                <option key={0} style={options.length || isLoading ? { display: 'none' } : {}}>
                    {!isLoading
                        ? options.length ? placeholder : noOptionsLabel
                        : t('select.loading')}
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

            {isLoading
                ? <span className="loading-input">
                    <FontAwesomeIcon icon={faCircleNotch} className="faSpin" />
                </span>
                : <></>}

            {children}
        </div>
    </div>
}

export default Select;