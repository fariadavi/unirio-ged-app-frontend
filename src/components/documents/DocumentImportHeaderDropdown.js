import React from 'react'
import Dropdown from '../util/Dropdown'
import { Button, Dropdown as BSDropdown } from 'react-bootstrap'
import { Icon } from '../util/CustomIcon'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons'

const customToggle = React.forwardRef(({ children, onClick }, ref) => (
    <div className="toggle" ref={ref} onClick={(e) => { e.preventDefault(); onClick(e); }}>
        {children}
    </div>
));

const customToggleIcon = <Icon icon={faEllipsisV} />

const DocumentImportHeaderDropdown = ({ children, labelPrimaryBtn, labelSecondaryBtn, onToggle, onSelect, style }) =>
    <Dropdown
        className="center"
        drop="up"
        menuAlign="right"
        customToggleComponent={customToggle}
        customToggleIcon={customToggleIcon}
        onToggle={onToggle}
        style={style}
    >
        {children}
        
        <div className="items-btns">            
            <BSDropdown.Item
                as={Button}
                onSelect={() => onSelect('secondary')}
                size="sm"
                variant="primary"
            >
                <span>{labelSecondaryBtn}</span>
            </BSDropdown.Item>
            <BSDropdown.Item
                as={Button}
                onSelect={() => onSelect('primary')}
                size="sm"
                variant="primary"
            >
                <span>{labelPrimaryBtn}</span>
            </BSDropdown.Item>
        </div>
    </Dropdown>

export default DocumentImportHeaderDropdown;