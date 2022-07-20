import React from 'react'
import { useTranslation } from 'react-i18next'
import '../../style/PageNotFound.css'

export default function PageNotFound() {
    const { t } = useTranslation();

    return (
        <div className="page-not-found">
            <h1>{t('pageNotFound.title')}</h1>
            <h2>{t('pageNotFound.subtitle')}</h2>

            <p className="message">
                {t('pageNotFound.message')}
            </p>
            <a href="/">{t('pageNotFound.home')}</a>
            <p className="contactUs">
                {t('pageNotFound.contactUs')}
            </p>
        </div>
    )
}
