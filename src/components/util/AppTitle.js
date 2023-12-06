import React from 'react'
import '../../style/utils/AppTitle.css'

const AppTitle = () =>
    <div className="app-title">
        <img src='/images/logo_unirio.svg' alt='Logo UNIRIO' width="112" />
        <div className="title-text">
            <h1>UNIRIO GED App</h1>
            <h6>Sistema de Gestão de Documentos da UNIRIO</h6>
        </div>
    </div>

export default AppTitle;