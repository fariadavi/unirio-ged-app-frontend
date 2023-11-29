import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Form } from 'react-bootstrap'
import { AddButton, ClearButton } from '../CustomButtons'
import { validateField } from '../Validation'
import { CustomTableBooleanFilter, CustomTableTextFilter } from './CustomTableFilters'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'

const CustomTableAddRow = ({
    columns,
    domain,
    disabled = false,
    addBtnIcon,
    onAdd
}) => {
    const { t } = useTranslation();
    const [newDataRow, setNewDataRow] = useState({});
    const [newDataRowValidation, setNewDataRowValidation] = useState({});
    const [isAddingData, setAddingData] = useState(false);

    const defaultTextFieldPlaceholder = t('customTable.addRow.text.placeholder')
    const i18nAddButtonTooltipKey = t(`${domain}.customTable.addRow.addBtn.tooltip`, '')
        ? `${domain}.customTable.addRow.addBtn.tooltip`
        : 'customTable.addRow.addBtn.tooltip'

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

    const addNewDataRow = async newDataRow => {
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
            setAddingData(true);

            await onAdd(newDataRow);

            setAddingData(false);

            setNewDataRow({});
            setNewDataRowValidation({});
        }
    }

    return (
        <tr key="0" className="extra-row add-row">
            {Object.entries(columns).map(([key, config], i, arr) => {
                const isFieldRequiredOnAdd = config?.requiredOnAdd;
                const indexOfPreviousRequiredOnAddField = arr.findIndex(([k, v], j) => j < i && v.requiredOnAdd);
                const indexOfNextRequiredOnAddField = arr.findIndex(([k, v], j) => j > i && v.requiredOnAdd);
                const colSpanUntilNextRequiredOnAddField = arr.slice(i,
                    indexOfNextRequiredOnAddField === -1
                        ? arr.length
                        : indexOfNextRequiredOnAddField
                ).length;
                const shouldRender = isFieldRequiredOnAdd || indexOfPreviousRequiredOnAddField === -1;

                return (shouldRender &&
                    <td key={key} colSpan={colSpanUntilNextRequiredOnAddField}>
                        {config?.requiredOnAdd &&
                            <div className={config.class}>
                                <Form.Group className="textbox">
                                    <Form.Control
                                        disabled={disabled || isAddingData}
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
                )
            }
            )}
            <td>
                {!disabled &&
                    <div className="actions spaced">
                        {isAddingData
                            ? <FontAwesomeIcon icon={faCircleNotch} className="faSpin" style={{ marginTop: '.25rem' }} />
                            : <AddButton
                                icon={addBtnIcon}
                                i18nTooltipKey={i18nAddButtonTooltipKey}
                                onClick={() => addNewDataRow(newDataRow)}
                            />}
                    </div>
                }
            </td>
        </tr >
    )
}

const customFilterForType = type => {
    switch (type) {
        case 'boolean':
            return CustomTableBooleanFilter
        case 'text':
        default:
            return CustomTableTextFilter
    }
}

const CustomTableFilter = ({ domain, disabled, property, onChange, type, value }) =>
    React.createElement(customFilterForType(type), {
        domain: domain,
        disabled: disabled,
        property: property,
        onChange: onChange,
        value: value
    })

const CustomTableFilterRow = ({
    clearBtnIcon,
    columns,
    domain,
    disabled = false,
    filterMap,
    onFilter
}) => {
    const { t } = useTranslation();
    const i18nClearButtonTooltipKey = t(`${domain}.customTable.filterRow.clearBtn.tooltip`, '')
        ? `${domain}.customTable.filterRow.clearBtn.tooltip`
        : 'customTable.filterRow.clearBtn.tooltip'

    return (
        <tr key="0" className="extra-row filter-row">
            {Object.entries(columns).map(([key, config]) =>
                <td key={key}>
                    {config?.filterable &&
                        <div className={config.class}>
                            <CustomTableFilter
                                domain={domain}
                                disabled={disabled}
                                onChange={value => onFilter(key, value)}
                                property={key}
                                type={config?.type}
                                value={filterMap?.[key]}
                            />
                        </div>
                    }
                </td>
            )}
            <td>
                {!disabled &&
                    <div className="actions spaced">
                        <ClearButton
                            icon={clearBtnIcon}
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