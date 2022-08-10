import React from 'react'
import { Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

export const CustomTableBooleanFilter = ({ domain, disabled, property, value, onChange }) => {
    const { t } = useTranslation();

    const CustomFormCheck = ({ label, checkBoolType }) =>
        <Form.Check
            custom
            type='checkbox'
            id={`${property}-${checkBoolType}`}
            label={label || t(`customTable.filterRow.boolean.${checkBoolType}`)}
            disabled={disabled || (value && value !== checkBoolType)}
            onChange={e => onChange(e.currentTarget.checked ? checkBoolType : '')}
            checked={value === checkBoolType}
        />

    return (
        <div className="center">
            <div className="boolean-filter">
                <CustomFormCheck
                    checkBoolType="y"
                    label={t(`${domain}.customTable.filterRow.${property}.y`, '')}
                />
                <CustomFormCheck
                    checkBoolType="n"
                    label={t(`${domain}.customTable.filterRow.${property}.n`, '')}
                />
            </div>
        </div>
    );
}

export const CustomTableTextFilter = ({ domain, disabled, property, value, onChange }) => {
    const { t } = useTranslation();

    return (
        <div>
            <Form.Control
                type="text"
                disabled={disabled}
                onChange={e => onChange(e.target.value)}
                placeholder={
                    t(`${domain}.customTable.filterRow.${property}.placeholder`, '')
                    || t('customTable.filterRow.text.placeholder')
                }
                value={value || ''}
                size="sm" />
        </div>
    );
}