import React from 'react'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'

const LoadButton = ({ btnText, isLoading, className, onClick, type, variant = "primary" }) =>
    <Button
        className={className}
        disabled={isLoading}
        onClick={onClick}
        variant={variant}
        type={type}>
        <div className="loadBtn">
            <span style={{ visibility: isLoading ? 'hidden' : 'visible' }}>{btnText}</span>
            {isLoading && <FontAwesomeIcon icon={faCircleNotch} className="faSpin" />}
        </div>
    </Button>

export default LoadButton;