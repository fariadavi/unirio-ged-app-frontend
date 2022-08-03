import React from 'react'
import { useTranslation } from 'react-i18next'
import ReactTooltip from 'react-tooltip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { UsersTableBooleanFilter, UsersTableTextFilter } from './UserPermissionsTableFilters'

const UserPermissionsTableFilterRow = ({ disabled, filterMap, filterUsers, permissions }) => {
    const { t } = useTranslation();

    return (
        <tr key="0" className="filter-row">
            <td>
                <UsersTableBooleanFilter
                    disabled={disabled}
                    filterType="status"
                    value={filterMap['status']}
                    onCheck={(filter, value) => filterUsers(filter, value)}
                    labelYes={t('user.table.filters.status.y')}
                    labelNo={t('user.table.filters.status.n')}
                />
            </td>
            <td>
                <UsersTableTextFilter
                    disabled={disabled}
                    filterType="email"
                    value={filterMap['email']}
                    onChange={(filter, value) => filterUsers(filter, value)}
                />
            </td>
            <td>
                <UsersTableTextFilter
                    disabled={disabled}
                    filterType="username"
                    value={filterMap['username']}
                    onChange={(filter, value) => filterUsers(filter, value)}
                />
            </td>
            {permissions.map(p =>
                <td key={`${p.toLowerCase()}-filter`}>
                    <UsersTableBooleanFilter
                        disabled={disabled}
                        filterType={p}
                        value={filterMap[p]}
                        onCheck={(filter, value) => filterUsers(filter, value)}
                    />
                </td>
            )}
            <td>
                {disabled
                    ? <></>
                    : <div className="actions spaced top-margin">
                        <span 
                            data-for="clearFilterTooltip"
                            data-tip={t('user.table.filters.buttons.clear')}
                            onClick={() => filterUsers()}
                        >
                            <FontAwesomeIcon className="icon" icon={faTimes} />
                            <ReactTooltip id="clearFilterTooltip" />
                        </span>
                    </div>
                }
            </td>
        </tr>
    )
}

export default UserPermissionsTableFilterRow;