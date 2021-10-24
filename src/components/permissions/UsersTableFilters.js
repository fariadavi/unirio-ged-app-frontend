import React from 'react'
import { useTranslation } from 'react-i18next'
import { Form } from 'react-bootstrap'

export const UsersTableBooleanFilter = ({ disabled, filterType, value, onCheck }) => {
    const { t } = useTranslation();

    const CustomFormCheck = ({ checkBoolType }) =>
        <Form.Check
            custom
            type='checkbox'
            id={`${filterType}-${checkBoolType}`}
            label={t(`user.table.filters.boolean.${checkBoolType}`)}
            disabled={disabled || (value && value !== checkBoolType)}
            onChange={e => onCheck(filterType, e.currentTarget.checked ? checkBoolType : '')}
            checked={value === checkBoolType}
        />

    return (
        <div className="center filter boolean-filter top-margin">
            <CustomFormCheck checkBoolType="y" />
            <CustomFormCheck checkBoolType="n" />
        </div>
    );
}

export const UsersTableTextFilter = ({ disabled, filterType, value, onChange }) => {
    const { t } = useTranslation();

    return (
        <Form.Control
            type="text"
            disabled={disabled}
            onChange={e => onChange(filterType, e.target.value.trimStart())}
            placeholder={t(`user.table.filters.text.${filterType}`)}
            value={value}
            size="sm" />
    );
}