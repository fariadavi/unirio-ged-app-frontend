import React from 'react'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBan, faCheckCircle, faPen, faFilter, faTimes, faTrash, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import ReactTooltip from 'react-tooltip'

const Button = ({ icon, tooltip = '', active = false, onClick, append }) => {
    const tooltipId = crypto.randomUUID();
    return (
        <span
            className={`icon ${active ? 'active' : ''}`}
            data-for={tooltipId}
            data-tip={tooltip}
            onClick={dataId => onClick(dataId)}>
            <FontAwesomeIcon className="icon" icon={icon} />
            {append}
            <ReactTooltip id={tooltipId} />
        </span>
    )
}

const AddButton = ({ icon = faPlusCircle, i18nTooltipKey, active, onClick }) => {
    const { t } = useTranslation();

    return (
        <Button
            icon={icon}
            tooltip={t(i18nTooltipKey, t('customButtons.add.tooltip'))}
            active={active}
            onClick={onClick}
        />)
}

const EditButton = ({ icon = faPen, i18nTooltipKey, onClick }) => {
    const { t } = useTranslation();

    return (
        <Button
            icon={icon}
            tooltip={t(i18nTooltipKey, t('customButtons.edit.tooltip'))}
            onClick={dataId => onClick(dataId)}
        />)
}

const ConfirmButton = ({ icon = faCheckCircle, i18nTooltipKey, onClick }) => {
    const { t } = useTranslation();

    return (
        <Button
            icon={icon}
            tooltip={t(i18nTooltipKey, t('customButtons.confirm.tooltip'))}
            onClick={dataId => onClick(dataId)}
        />)
}
const CancelButton = ({ icon = faBan, i18nTooltipKey, onClick }) => {
    const { t } = useTranslation();

    return (
        <Button
            icon={icon}
            tooltip={t(i18nTooltipKey, t('customButtons.cancel.tooltip'))}
            onClick={dataId => onClick(dataId)}
        />)
}

const FilterButton = ({ icon = faFilter, i18nTooltipKey, active, onClick, activeFilterCount }) => {
    const { t } = useTranslation();

    return (
        <Button
            icon={icon}
            tooltip={t(i18nTooltipKey, t('customButtons.filter.tooltip'))}
            active={active}
            onClick={onClick}
            append={
                <span className="activeFilterCount">
                    {!!activeFilterCount && `(${activeFilterCount})`}
                </span>
            }
        />)
}

const DeleteButton = ({ icon = faTrash, i18nTooltipKey, onClick }) => {
    const { t } = useTranslation();

    return (
        <Button
            icon={icon}
            tooltip={t(i18nTooltipKey, t('customButtons.delete.tooltip'))}
            onClick={dataId => onClick(dataId)}
        />)
}

const ClearButton = ({ icon = faTimes, i18nTooltipKey, onClick }) => {
    const { t } = useTranslation();

    return (<Button
        icon={icon}
        tooltip={t(i18nTooltipKey, t('customButtons.clear.tooltip'))}
        onClick={onClick}
    />)
}

export {
    Button as BasicButton,
    AddButton,
    EditButton,
    ConfirmButton,
    CancelButton,
    FilterButton,
    DeleteButton,
    ClearButton
}