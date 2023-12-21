import React from 'react'
import '../../style/utils/AppTitle.css'

const AppTitle = () =>
    <div className="app-title">
        <img src='/images/logo_unirio.svg' alt='Logo UNIRIO' width="112" />
        <div className="title-text">
            <h1>read</h1>
            <h6 style={{ marginLeft: '2px' }}>repositório eletrônico de<br/>arquivos e documentos</h6>
        </div>
    </div>

export default AppTitle;