import React from 'react'
import { v4 as uuid } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ReactTooltip from 'react-tooltip'

export const Icon = ({ icon, tooltip = '' }) => {
    const tooltipId = uuid();
    return (
        <span
            data-for={tooltipId}
            data-tip={tooltip}>
            <FontAwesomeIcon className="icon" icon={icon} />
            <ReactTooltip id={tooltipId} />
        </span>
    )
}