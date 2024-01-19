import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'
import { CustomTableHeaderActions, CustomTableBodyActions } from './CustomTableActions'
import { CustomTableAddRow, CustomTableFilterRow } from './CustomTableExtraRows'
import { CustomTableDataField } from './CustomTableDataField'
import TablePagination from '../TablePagination'
import { Icon } from '../CustomIcon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch, faSortAlphaDown, faSortAlphaDownAlt, faSortAmountDown, faSortAmountDownAlt } from '@fortawesome/free-solid-svg-icons'
import '../../../style/utils/CustomTable.css'

const CustomTable = ({ actions = { filter: {} }, columns = {}, data = [], domain, isLoadingData = false, pageSize = 10, style={} }) => {
    const [showAddRow, setShowAddRow] = useState(false);
    const [showFilterRow, setShowFilterRow] = useState(false);
    const [isBatchEditing, setBatchEditing] = useState(false);
    const [editingRows, setEditingRows] = useState({});
    const [filteredRowIds, setFilteredRowIds] = useState([]);
    const [filterMap, setFilterMap] = useState({});
    const [sortProperty, setSortProperty] = useState();
    const [sortDirection, setSortDirection] = useState('ASC');
    const [currentPage, setCurrentPage] = useState(1);
    const [actionOnDataList, setActionOnDataList] = useState([]);

    useEffect(() => {
        setShowAddRow(false);
        setShowFilterRow(false);
        setBatchEditing(false);
        setEditingRows({});
        setFilteredRowIds([]);
        setFilterMap({});
        setSortProperty(Object.entries(columns).find(([key, value]) => value.sort)?.[0]);
        setSortDirection('ASC');
        setCurrentPage(1);
    }, [columns])

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
            setActionOnDataList(ids => [...ids, dataId]);

            const dataRow = editingRows[dataId];
            const dataRowEntries = Object.entries(dataRow);
            const result =
                dataRowEntries.length
                    && dataRowEntries.some(([key, value]) =>
                        (typeof value === 'string'
                            ? value.trim()
                            : value) !== data.find(d => d.id === dataId)[key]
                    )
                    ? await actions.edit?.callbackFn(dataId, dataRow)
                    : true;

            if (result) {
                const { [dataId]: _, ...newEditingFields } = editingRows
                setEditingRows(newEditingFields)
            }

            setActionOnDataList(ids => ids.filter(id => id !== dataId));
        }
    }

    const toggleBatchEdit = () => {
        if (isBatchEditing) setEditingRows({});
        setBatchEditing(!isBatchEditing);
    }

    const confirmBatchEdit = async () => {
        if (!actions.batchEdit?.disabled && actions.batchEdit?.callbackFn) {
            setActionOnDataList(ids => [...ids, ...Object.keys(editingRows)]);

            const dataRows = Object.entries(editingRows);
            const result =
                dataRows.length
                    && dataRows.some(([key, value]) =>
                        Object.entries(value).some(([k, v]) =>
                            (typeof value === 'string'
                                ? value.trim()
                                : value) !== data.find(d => d.id === Number(key))[k]
                        )
                    )
                    ? await actions.batchEdit?.callbackFn(dataRows)
                    : true;

            if (result) {
                setEditingRows({});
                setBatchEditing(false);
            }

            setActionOnDataList([]);
        }
    }

    const addData = async newData => {
        if (!actions.add?.disabled && actions.add.callbackFn) {
            await actions.add.callbackFn(newData)
        }
    }

    const deleteData = async dataId => {
        if (!actions.delete?.disabled && actions.delete.callbackFn) {
            setActionOnDataList(ids => [...ids, dataId]);

            await actions.delete.callbackFn(dataId)

            setActionOnDataList(ids => ids.filter(id => id !== dataId));
        }
    }

    const filterData = (filter, value) => setFilterMap(
        filter
            ? value
                ? { ...filterMap, [filter]: value }
                : () => { const { [filter]: _, ...newFilterMap } = filterMap; return newFilterMap }
            : {}
    )

    const getSortIcon = type =>
        type === 'text'
            ? sortDirection === 'ASC'
                ? faSortAlphaDown
                : faSortAlphaDownAlt
            : sortDirection === 'ASC'
                ? faSortAmountDownAlt
                : faSortAmountDown

    const toggleSortByColumn = key =>
        setSortDirection(key === sortProperty
            ? sortDirection === 'DESC' ? 'ASC' : 'DESC'
            : () => { setSortProperty(key); return 'ASC' }
        )

    return (<>
        <Table className="customTable" striped size="sm" style={style}>
            <thead>
                <tr>
                    {Object.entries(columns).map(([key, config]) =>
                        <th key={key} width={config.width}>
                            <div className={config.class}>
                                <span
                                    className='sort-header'
                                    onClick={() => toggleSortByColumn(key)}
                                >
                                    {config.header}
                                    {key === sortProperty && <Icon icon={getSortIcon(config.type)} />}
                                </span>
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
                        addBtnIcon={actions?.add?.rowActionIcon}
                        onAdd={newData => addData(newData)}
                    />}
                {showFilterRow &&
                    <CustomTableFilterRow
                        clearBtnIcon={actions?.filter?.rowActionIcon}
                        columns={columns}
                        domain={domain}
                        disabled={isBatchEditing}
                        filterMap={filterMap}
                        onFilter={(filter, value) => filterData(filter, value)}
                    />}
                {isLoadingData
                    ? <tr>
                        <td colSpan={Object.keys(columns).length + (Object.keys(actions).some(k => !actions[k]?.disabled) ? 1 : 0)}>
                            <FontAwesomeIcon icon={faCircleNotch} className="faSpin" style={{ width: '100%' }} />
                        </td>
                    </tr>
                    : data
                        .filter(dataRow => !filteredRowIds.includes(dataRow.id))
                        .sort((a, b) => {
                            switch (columns?.[sortProperty]?.type) {
                                case 'boolean':
                                    return (a[sortProperty] === b[sortProperty])
                                        ? 0 : a[sortProperty]
                                            ? sortDirection === 'ASC' ? -1 : 1
                                            : sortDirection === 'ASC' ? 1 : -1;
                                case 'text':
                                    return sortDirection === 'ASC'
                                        ? a[sortProperty].localeCompare(b[sortProperty])
                                        : b[sortProperty].localeCompare(a[sortProperty]);
                                case 'number':
                                    return sortDirection === 'ASC'
                                        ? a[sortProperty] - b[sortProperty]
                                        : b[sortProperty] - a[sortProperty]
                                default:
                                    return sortDirection === 'ASC'
                                        ? a.id - b.id
                                        : b.id - a.id
                            }
                        })
                        .slice(
                            (currentPage - 1) * pageSize,
                            (currentPage * pageSize) < (data.length - filteredRowIds.length)
                                ? (currentPage * pageSize)
                                : (data.length - filteredRowIds.length)
                        )
                        .map(dataRow => {
                            const editingRow = editingRows[dataRow.id?.toString()];

                            return (
                                <tr key={dataRow.id}>
                                    {Object.entries(columns).map(([key, config]) =>
                                        <td key={key}>
                                            <div className={config?.class}>
                                                <CustomTableDataField
                                                    disguise={config?.disguise?.[dataRow[key]]}
                                                    isEditing={(isBatchEditing || !!editingRow) && config?.editable !== false}
                                                    onChange={value => setEditData(dataRow.id, key, value)}
                                                    type={config?.type}
                                                    value={editingRow?.[key] === undefined ? dataRow[key] : editingRow[key]}
                                                />
                                            </div>
                                        </td>
                                    )}
                                    {!!Object.keys(actions).some(k => !actions[k]?.disabled) &&
                                        <td>
                                            <div className="actions spaced">
                                                {actionOnDataList.some(id => id?.toString() === dataRow.id?.toString())
                                                    ? <FontAwesomeIcon icon={faCircleNotch} className="faSpin" style={{ marginTop: '.25rem' }} />
                                                    : <CustomTableBodyActions
                                                        actions={actions}
                                                        dataId={dataRow.id}
                                                        isBatchEditing={isBatchEditing}
                                                        isEditingRow={!!editingRow}
                                                        onClickEditBtn={dataId => toggleEditData(dataId)}
                                                        onClickConfirmEditBtn={dataId => confirmEditData(dataId)}
                                                        onClickCancelEditBtn={dataId => toggleEditData(dataId)}
                                                        onClickDeleteBtn={dataId => deleteData(dataId)}
                                                    />}
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