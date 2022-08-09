import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'
import { CustomTableHeaderActions, CustomTableBodyActions } from './CustomTableActions'
import { CustomTableAddRow, CustomTableFilterRow } from './CustomTableExtraRows'
import { CustomTableDataField } from './CustomTableDataField'
import TablePagination from '../TablePagination'
import '../../../style/utils/CustomTable.css'

const CustomTable = ({ actions = { filter: {} }, columns = {}, data = [], domain, pageSize = 10 }) => {
    const [showAddRow, setShowAddRow] = useState(false);
    const [showFilterRow, setShowFilterRow] = useState(false);
    const [isBatchEditing, setBatchEditing] = useState(false);
    const [editingRows, setEditingRows] = useState({});
    const [filteredRowIds, setFilteredRowIds] = useState([]);
    const [filterMap, setFilterMap] = useState({});
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if (!data.length)
            return;

        const evalBooleanIsBooleanFilter = (booleanValue, filter) =>
            !filter || (filter === 'y' && booleanValue) || (filter === 'n' && !booleanValue)

        const evalStringContainsStringFilter = (string, filter) =>
            !filter || string.toLowerCase().includes(filter.toLowerCase())

        const evaluateFilter = (dataRow, [key, value]) => {
            switch (columns?.[key]?.type) {
                case 'boolean':
                    return evalBooleanIsBooleanFilter(dataRow[key], value);
                case 'text':
                default:
                    return evalStringContainsStringFilter(dataRow[key], value);
            }
        }
        setFilteredRowIds(
            data.filter(dataRow =>
                Object.entries(filterMap)
                    .some(filterEntry =>
                        !evaluateFilter(dataRow, filterEntry)
                    ))
                .map(dataRow => dataRow.id)
        );
    }, [columns, data, filterMap]);

    useEffect(() => {
        const numPages = Math.ceil((data.length - filteredRowIds.length) / pageSize) || 1;
        if (currentPage > numPages) setCurrentPage(numPages);
    }, [filteredRowIds, currentPage, data, pageSize]);

    const toggleShowAddRow = () => {
        if (!showAddRow && showFilterRow) setShowFilterRow(false);
        setShowAddRow(!showAddRow);
    }

    const toggleShowFilterRow = () => {
        if (!showFilterRow && showAddRow) setShowAddRow(false);
        if (showFilterRow) filterData();
        setShowFilterRow(!showFilterRow);
    }

    const toggleEditData = dataId => {
        if (Object.keys(editingRows).includes(dataId.toString())) {
            const { [dataId]: _, ...newEditingFields } = editingRows
            setEditingRows(newEditingFields)
        }
        else
            setEditingRows({ ...editingRows, [dataId]: {} })
    }

    const setEditData = (dataId, field, value) =>
        setEditingRows({ ...editingRows, [dataId]: { ...editingRows[dataId], [field]: value } })

    const confirmEditData = async dataId => {
        if (!actions.edit?.disabled && actions.edit?.callbackFn) {
            const dataRow = editingRows[dataId];
            const dataRowEntries = Object.entries(dataRow);
            const result =
                dataRowEntries.length
                    && dataRowEntries.some(([key, value]) =>
                        value.trim() !== data.find(d => d.id === dataId)[key]
                    )
                    ? await actions.edit?.callbackFn(dataId, dataRow)
                    : true;

            if (result) {
                const { [dataId]: _, ...newEditingFields } = editingRows
                setEditingRows(newEditingFields)

                if (result) console.log('Edit successful')
            } else console.log('Edit failed')
        }
    }

    const toggleBatchEdit = () => {
        if (isBatchEditing) setEditingRows({});
        setBatchEditing(!isBatchEditing);
    }

    const confirmBatchEdit = async () => {
        if (!actions.batchEdit?.disabled && actions.batchEdit?.callbackFn) {
            const dataRows = Object.entries(editingRows);
            const result =
                dataRows.length
                    && dataRows.some(([key, value]) =>
                        Object.entries(value).some(([k, v]) =>
                            v.trim() !== data.find(d => d.id === Number(key))[k]
                        )
                    )
                    ? await actions.batchEdit?.callbackFn(dataRows)
                    : true;

            if (result) {
                setEditingRows({});
                setBatchEditing(false);

                if (result) console.log('Batch edit successful')
            } else console.log('Batch edit failed')
        }
    }

    const addData = async newData => {
        if (!actions.add?.disabled && actions.add.callbackFn) {
            const result = await actions.add.callbackFn(newData)
            if (result) console.log('Add successful')
            else console.log('Add failed')
        }
    }

    const deleteData = async dataId => {
        if (!actions.delete?.disabled && actions.delete.callbackFn) {
            const result = await actions.delete.callbackFn(dataId)
            if (result) console.log('Delete successful')
            else console.log('Delete failed')
        }
    }

    const filterData = (filter, value) => setFilterMap(
        filter
            ? value
                ? { ...filterMap, [filter]: value }
                : () => { const { [filter]: _, ...newFilterMap } = filterMap; return newFilterMap }
            : {}
    )

    return (<>
        <Table className="customTable" striped size="sm">
            <thead>
                <tr>
                    {Object.entries(columns).map(([key, config]) =>
                        <th key={key} width={config.width}>
                            <div className={config.class}>
                                {config.header}
                            </div>
                        </th>
                    )}
                    {!!Object.keys(actions).some(k => !actions[k]?.disabled) &&
                        <th width="120px">
                            <div className="actions spaced">
                                <CustomTableHeaderActions
                                    actions={actions}
                                    activeFilterCount={Object.keys(filterMap).length}
                                    domain={domain}

                                    isAdding={showAddRow}
                                    onClickAddBtn={toggleShowAddRow}

                                    isFiltering={showFilterRow}
                                    onClickFilterBtn={() => toggleShowFilterRow()}

                                    isBatchEditing={isBatchEditing}
                                    onClickEditBtn={() => toggleBatchEdit()}
                                    onClickConfirmEditBtn={() => confirmBatchEdit()}
                                    onClickCancelEditBtn={() => toggleBatchEdit()}
                                />
                            </div>
                        </th>
                    }
                </tr>
            </thead>
            <tbody>
                {showAddRow &&
                    <CustomTableAddRow
                        columns={columns}
                        domain={domain}
                        disabled={isBatchEditing}
                        onAdd={newData => addData(newData)}
                    />}
                {showFilterRow &&
                    <CustomTableFilterRow
                        columns={columns}
                        domain={domain}
                        disabled={isBatchEditing}
                        filterMap={filterMap}
                        onFilter={(filter, value) => filterData(filter, value)}
                    />}
                {data
                    .filter(dataRow => !filteredRowIds.includes(dataRow.id))
                    .sort((a, b) => a.id - b.id)
                    .slice(
                        (currentPage - 1) * pageSize,
                        (currentPage * pageSize) < (data.length - filteredRowIds.length)
                            ? (currentPage * pageSize)
                            : (data.length - filteredRowIds.length)
                    )
                    .map(dataRow => {
                        const isEditingRow = Object.keys(editingRows).includes(dataRow.id?.toString());

                        return (
                            <tr key={dataRow.id}>
                                {Object.entries(columns).map(([key, config]) =>
                                    <td key={key}>
                                        <div className={config?.class}>
                                            <CustomTableDataField
                                                isEditing={(isBatchEditing || isEditingRow) && config?.editable !== false}
                                                onChange={value => setEditData(dataRow.id, key, value)}
                                                type={config?.type}
                                                value={dataRow[key]}
                                                disguise={config?.disguise?.[dataRow[key]]}
                                            />
                                        </div>
                                    </td>
                                )}
                                {!!Object.keys(actions).some(k => !actions[k]?.disabled) &&
                                    <td>
                                        <div className="actions spaced">
                                            <CustomTableBodyActions
                                                actions={actions}
                                                dataId={dataRow.id}
                                                isBatchEditing={isBatchEditing}
                                                isEditingRow={isEditingRow}
                                                onClickEditBtn={dataId => toggleEditData(dataId)}
                                                onClickConfirmEditBtn={dataId => confirmEditData(dataId)}
                                                onClickCancelEditBtn={dataId => toggleEditData(dataId)}
                                                onClickDeleteBtn={dataId => deleteData(dataId)}
                                            />
                                        </div>
                                    </td>
                                }
                            </tr>
                        )
                    })}
            </tbody>
        </Table>
        <TablePagination
            numPages={Math.ceil((data.length - filteredRowIds.length) / pageSize) || 1}
            activePage={currentPage}
            onSearch={page => setCurrentPage(page)}
        />
    </>)
}

export default CustomTable;