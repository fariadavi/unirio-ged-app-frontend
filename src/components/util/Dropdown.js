import React from 'react'
import { Dropdown as BsDropdown } from 'react-bootstrap'

const Dropdown = ({ className = '', drop, menuAlign, children, onToggle, style, customToggleIcon, customToggleComponent }) => {
    return (
        <BsDropdown
            className={`dropdown ${className}`}
            drop={drop}
            onToggle={onToggle}
            style={style}
        >
            <BsDropdown.Toggle id={crypto.randomUUID()} as={customToggleComponent}>
                {customToggleIcon}
            </BsDropdown.Toggle>

            <BsDropdown.Menu align={menuAlign}>
                {children}
            </BsDropdown.Menu>
        </BsDropdown>
    )
}

export default Dropdown;