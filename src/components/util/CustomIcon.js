import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ReactTooltip from 'react-tooltip'

export const Icon = ({ className = '', icon, tooltip = '', style }) => {
    const tooltipId = crypto.randomUUID();
    return (
        <span
            data-for={tooltipId}
            data-tip={tooltip}>
            <FontAwesomeIcon className={`icon ${className}`} icon={icon} style={style} />
            <ReactTooltip id={tooltipId} />
        </span>
    )
}