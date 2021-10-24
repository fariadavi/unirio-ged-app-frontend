import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBan, faTimes } from '@fortawesome/free-solid-svg-icons'
import { UsersTableBooleanFilter, UsersTableTextFilter } from './UsersTableFilters'

const UsersTableFilterRow = ({ disabled, filterMap, filterUsers, permissions, hideFilterBar, visible }) =>
    <tr key="0" style={{ display: visible ? "" : "none" }}>
        <td>
            <UsersTableTextFilter
                disabled={disabled}
                filterType="username"
                value={filterMap['username']}
                onChange={(filter, value) => filterUsers(filter, value)}
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
            <UsersTableBooleanFilter
                disabled={disabled}
                filterType={permissions[0]}
                value={filterMap[permissions[0]]}
                onCheck={(filter, value) => filterUsers(filter, value)}
            />
        </td>
        <td>
            <UsersTableBooleanFilter
                disabled={disabled}
                filterType={permissions[1]}
                value={filterMap[permissions[1]]}
                onCheck={(filter, value) => filterUsers(filter, value)}
            />
        </td>
        <td>
            <UsersTableBooleanFilter
                disabled={disabled}
                filterType={permissions[2]}
                value={filterMap[permissions[2]]}
                onCheck={(filter, value) => filterUsers(filter, value)}
            />
        </td>
        <td>
            <UsersTableBooleanFilter
                disabled={disabled}
                filterType={permissions[3]}
                value={filterMap[permissions[3]]}
                onCheck={(filter, value) => filterUsers(filter, value)}
            />
        </td>
        <td>
            <UsersTableBooleanFilter
                disabled={disabled}
                filterType={permissions[4]}
                value={filterMap[permissions[4]]}
                onCheck={(filter, value) => filterUsers(filter, value)}
            />
        </td>
        <td>
            <UsersTableBooleanFilter
                disabled={disabled}
                filterType={permissions[5]}
                value={filterMap[permissions[5]]}
                onCheck={(filter, value) => filterUsers(filter, value)}
            />
        </td>
        <td>
            <UsersTableBooleanFilter
                disabled={disabled}
                filterType={permissions[6]}
                value={filterMap[permissions[6]]}
                onCheck={(filter, value) => filterUsers(filter, value)}
            />
        </td>
        <td>
            {disabled
                ? <></>
                : <div className="actions spaced top-margin">
                    <span onClick={() => filterUsers()}>
                        <FontAwesomeIcon className="icon" icon={faTimes} />
                    </span>
                    <span onClick={() => hideFilterBar()}>
                        <FontAwesomeIcon className="icon" icon={faBan} />
                    </span>
                </div>
            }
        </td>
    </tr>

export default UsersTableFilterRow;