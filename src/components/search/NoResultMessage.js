import React from 'react'
import { useTranslation } from 'react-i18next'

const NoResultMessage = ({ currentQueryString }) => {
    const { t } = useTranslation();

    return (
        <div className="no-result-message-box">
            <p>
                {t('search.noResultFound.message.p1')}
                {currentQueryString.length ? t('search.noResultFound.message.p2') : ''}
                <b style={{ display: currentQueryString.length ? 'inline-block' : 'none' }}>{currentQueryString}</b>
                {t('search.noResultFound.message.p3')}
            </p>
            <div>
                <p style={{ marginBottom: 0 }}>{t('search.noResultFound.searchTips.title')}</p>
                <ul>
                    <li>- {t('search.noResultFound.searchTips.item1')}</li>
                    <li>- {t('search.noResultFound.searchTips.item2')}</li>
                    <li>- {t('search.noResultFound.searchTips.item3')}</li>
                    <li>- {t('search.noResultFound.searchTips.item4')}</li>
                </ul>
            </div>
        </div>
    )
}

export default NoResultMessage;
