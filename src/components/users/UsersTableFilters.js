import React from 'react'
import { Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

export const UsersTableBooleanFilter = ({ disabled, filterType, value, onCheck, labelYes, labelNo }) => {
    const { t } = useTranslation();

    const CustomFormCheck = ({ label, checkBoolType }) =>
        <Form.Check
            custom
            type='checkbox'
            id={`${filterType}-${checkBoolType}`}
            label={label || t(`user.table.filters.boolean.${checkBoolType}`)}
            disabled={disabled || (value && value !== checkBoolType)}
            onChange={e => onCheck(filterType, e.currentTarget.checked ? checkBoolType : '')}
            checked={value === checkBoolType}
        />

    return (
        <div className="center">
            <div className="boolean-filter">
                <CustomFormCheck checkBoolType="y" label={labelYes} />
                <CustomFormCheck checkBoolType="n" label={labelNo} />
            </div>
        </div>
    );
}

export const UsersTableTextFilter = ({ disabled, filterType, value, onChange }) => {
    const { t } = useTranslation();

    return (
        <div className="top-margin">
            <Form.Control
                type="text"
                disabled={disabled}
                onChange={e => onChange(filterType, e.target.value)}
                placeholder={t(`user.table.filters.text.${filterType}`)}
                value={value}
                size="sm" />
        </div>
    );
}