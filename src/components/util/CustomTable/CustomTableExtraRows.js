import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Form } from 'react-bootstrap'
import { AddButton, ClearButton } from '../CustomButtons'
import { validateField } from '../Validation'

const CustomTableAddRow = ({
    columns,
    domain,
    disabled = false,
    onAdd
}) => {
    const { t } = useTranslation();
    const [newDataRow, setNewDataRow] = useState({});
    const [newDataRowValidation, setNewDataRowValidation] = useState({});

    const defaultTextFieldPlaceholder = t('customTable.addRow.text.placeholder')
    const i18nAddButtonTooltipKey = t(`${domain}.customTable.addRow.addBtn.tooltip`, '') || 'customTable.addRow.addBtn.tooltip'

    const updateNewRowData = (key, value) => {
        setNewDataRow(
            key
                ? value
                    ? { ...newDataRow, [key]: value }
                    : () => { const { [key]: _, ...newDataRow2 } = newDataRow; return newDataRow2 }
                : {}
        )

        setNewDataRowValidation({ ...newDataRowValidation, [key]: validateField(`${domain}.${key}`, value) })
    }

    const addNewDataRow = newDataRow => {
        const emptyValuesForRequiredFields = Object.entries(columns)
            .filter(([key, config]) => config?.requiredOnAdd && !newDataRow[key]?.length)

        if (emptyValuesForRequiredFields.length > 0) {
            let newDataRowValidationObj = {}
            emptyValuesForRequiredFields.forEach(([key]) => {
                newDataRowValidationObj = { ...newDataRowValidationObj, [key]: 'mandatoryField' }
            })
            setNewDataRowValidation({ ...newDataRowValidation, ...newDataRowValidationObj })
            
        } else if (Object.entries(columns)
            .filter(([key, config]) => config?.requiredOnAdd)
            .every(([key, config]) => newDataRowValidation[key] === '')
        ) {
            onAdd(newDataRow);

            setNewDataRow({});
            setNewDataRowValidation({});
        }
    }

    return (
        <tr key="0" className="extra-row add-row">
            {Object.entries(columns).map(([key, config]) =>
                <td key={key}>
                    {config?.requiredOnAdd &&
                        <div className={config.class}>
                            <Form.Group className="textbox">
                                <Form.Control
                                    disabled={disabled}
                                    placeholder={t(`${domain}.customTable.addRow.${key}.placeholder`, defaultTextFieldPlaceholder)}
                                    onChange={e => updateNewRowData(key, e.target.value)}
                                    onKeyPress={e => e.code === 'Enter' && addNewDataRow(newDataRow)}
                                    isValid={newDataRow?.[key]?.trim().length > 0 && !newDataRowValidation[key]}
                                    isInvalid={newDataRowValidation[key]}
                                    value={newDataRow?.[key] || ''}
                                    type="text"
                                    size="sm" />

                                <Form.Control.Feedback type="invalid" tooltip>
                                    {t(`${domain}.customTable.addRow.validation.${newDataRowValidation[key]}`,
                                        t(`customTable.addRow.validation.${newDataRowValidation[key]}`)
                                    )}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </div>
                    }
                </td>
            )}
            <td>
                {!disabled &&
                    <div className="actions spaced">
                        <AddButton
                            i18nTooltipKey={i18nAddButtonTooltipKey}
                            onClick={() => addNewDataRow(newDataRow)}
                        />
                    </div>
                }
            </td>
        </tr>
    )
}

const CustomTableFilterRow = ({
    columns,
    domain,
    disabled = false,
    filterMap,
    onFilter
}) => {
    const { t } = useTranslation();
    const defaultTextFieldPlaceholder = t('customTable.filterRow.text.placeholder')
    const i18nClearButtonTooltipKey = t(`${domain}.customTable.filterRow.clearBtn.tooltip`, '') || 'customTable.filterRow.clearBtn.tooltip'

    return (
        <tr key="0" className="extra-row filter-row">
            {Object.entries(columns).map(([key, config]) =>
                <td key={key}>
                    {config?.filterable &&
                        <div className={config.class}>
                            <Form.Control
                                type="text"
                                disabled={disabled}
                                onChange={e => onFilter(key, e.target.value)}
                                placeholder={t(`${domain}.customTable.filterRow.${key}.placeholder`, defaultTextFieldPlaceholder)}
                                value={filterMap?.[key] || ''}
                                size="sm" />
                        </div>
                    }
                </td>
            )}
            <td>
                {!disabled &&
                    <div className="actions spaced">
                        <ClearButton
                            i18nTooltipKey={i18nClearButtonTooltipKey}
                            onClick={() => onFilter()}
                        />
                    </div>
                }
            </td>
        </tr>
    )
}

export { CustomTableAddRow, CustomTableFilterRow };