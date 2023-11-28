import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'

const GlobalSpinner = () =>
    <div>
        <FontAwesomeIcon icon={faCircleNotch} className="faSpin loadOverlay color-blue" />
    </div>

export default GlobalSpinner;