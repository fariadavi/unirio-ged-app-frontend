import React from 'react'
import { Form } from 'react-bootstrap'

const CustomTableBooleanField = ({
    isEditing,
    onChange,
    value,
    disguise
}) =>
    isEditing
        ? <Form.Check
            className='check-input'
            type='checkbox'
            onChange={e => onChange(e.currentTarget.checked)}
            defaultChecked={value || false}
        />
        : (disguise ||
            <Form.Check
                disabled
                className='check-input'
                type='checkbox'
                checked={value || false}
            />)

const CustomTableTextField = ({
    isEditing,
    onChange,
    value
}) =>
    isEditing
        ? <Form.Control
            onChange={e => onChange(e.target.value)}
            defaultValue={value || ''}
            type='text'
            size='sm'
        />
        : (value || '')

const dataFieldForType = type => {
    switch (type) {
        case 'boolean':
            return CustomTableBooleanField
        case 'text':
        default:
            return CustomTableTextField
    }
}

export const CustomTableDataField = ({
    isEditing,
    onChange,
    type,
    value,
    disguise
}) => React.createElement(dataFieldForType(type), {
    isEditing: isEditing,
    onChange: onChange,
    value: value,
    disguise: disguise
});