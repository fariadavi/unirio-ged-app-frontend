import React from 'react'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'

const LoadButton = ({ children, isLoading, disabled, className, onClick, type, variant = "primary" }) =>
    <Button
        className={className}
        disabled={disabled || isLoading}
        onClick={onClick}
        variant={variant}
        type={type}>
        <div className="loadBtn">
            <span style={{ visibility: isLoading ? 'hidden' : 'visible' }}>
                {children}
            </span>
            {isLoading && <FontAwesomeIcon icon={faCircleNotch} className="faSpin" />}
        </div>
    </Button>

export default LoadButton;