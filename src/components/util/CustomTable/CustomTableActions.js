import React from 'react'
import { AddButton, EditButton, FilterButton, ConfirmButton, CancelButton, DeleteButton } from '../CustomButtons'

export const CustomTableHeaderActions = ({
    activeFilterCount,
    actions,
    domain,
    isAdding,
    isFiltering,
    isBatchEditing,
    onClickAddBtn,
    onClickEditBtn,
    onClickCancelEditBtn,
    onClickConfirmEditBtn,
    onClickFilterBtn
}) => {
    const enableAdd = !actions.add?.disabled && actions.add?.callbackFn;
    const enableBatchEdit = !actions.batchEdit?.disabled && actions.batchEdit?.callbackFn;
    const enableFilter = !actions.filter?.disabled;

    return (
        <>
            {!isBatchEditing
                ? (<>
                    {enableAdd &&
                        <AddButton
                            active={isAdding}
                            icon={actions.add?.icon}
                            onClick={() => onClickAddBtn()}
                            i18nTooltipKey={`${domain}.customTable.actions.addBtn.tooltip`}
                        />}
                    {enableBatchEdit &&
                        <EditButton
                            icon={actions.batchEdit?.icon}
                            onClick={() => onClickEditBtn()}
                            i18nTooltipKey={`${domain}.customTable.actions.batchEditBtn.tooltip`}
                        />}
                    {enableFilter &&
                        <FilterButton
                            active={isFiltering}
                            activeFilterCount={activeFilterCount}
                            icon={actions.filter?.icon}
                            onClick={() => onClickFilterBtn()}
                            i18nTooltipKey={`${domain}.customTable.actions.filterBtn.tooltip`}
                        />}
                </>)
                : (<>
                    <ConfirmButton
                        icon={actions.batchEdit?.confirm?.icon}
                        onClick={() => onClickConfirmEditBtn()}
                        i18nTooltipKey={`${domain}.customTable.actions.batchEdit.confirmBtn.tooltip`}
                    />
                    <CancelButton
                        icon={actions.batchEdit?.cancel?.icon}
                        onClick={() => onClickCancelEditBtn()}
                        i18nTooltipKey={`${domain}.customTable.actions.batchEdit.cancelBtn.tooltip`}
                    />
                </>)}
        </>
    )
}

export const CustomTableBodyActions = ({
    actions,
    domain,
    dataId,
    isBatchEditing,
    isEditingRow,
    onClickEditBtn,
    onClickConfirmEditBtn,
    onClickCancelEditBtn,
    onClickDeleteBtn
}) => {
    const enableEdit = !actions.edit?.disabled && actions.edit?.callbackFn;
    const disabledelete = !actions.delete?.disabled && actions.delete?.callbackFn;

    return (<>
        {!isBatchEditing &&
            (!isEditingRow
                ? (<>
                    {enableEdit &&
                        <EditButton
                            icon={actions.edit?.icon}
                            onClick={() => onClickEditBtn(dataId)}
                            i18nTooltipKey={`${domain}.customTable.actions.editBtn.tooltip`}
                        />}
                    {disabledelete &&
                        <DeleteButton
                            icon={actions.delete?.icon}
                            onClick={() => onClickDeleteBtn(dataId)}
                            i18nTooltipKey={`${domain}.customTable.actions.deleteBtn.tooltip`}
                        />}
                </>)
                : (<>
                    <ConfirmButton
                        icon={actions.edit?.confirm?.icon}
                        onClick={() => onClickConfirmEditBtn(dataId)}
                        i18nTooltipKey={`${domain}.customTable.actions.edit.confirmBtn.tooltip`}
                    />
                    <CancelButton
                        icon={actions.edit?.cancel?.icon}
                        onClick={() => onClickCancelEditBtn(dataId)}
                        i18nTooltipKey={`${domain}.customTable.actions.edit.cancelBtn.tooltip`}
                    />
                </>)
            )}
    </>)
}