import React from 'react'
import { Form } from 'react-bootstrap'

const CustomTableBooleanField = ({
    isEditing,
    onChange,
    value,
    disguise
}) =>
    (!isEditing && disguise)
    || <Form.Check
        checked={!!value || false}
        className='check-input'
        disabled={!isEditing}
        onChange={e => onChange(e.currentTarget.checked)}
        type='checkbox'
    />

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
        : (value?.toString()?.trim() || '')

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