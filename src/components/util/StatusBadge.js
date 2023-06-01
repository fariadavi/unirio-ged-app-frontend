import React from 'react'
import { Badge } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

export default function StatusBadge({ status }) {
    const { t } = useTranslation();

    status = status || ''

    let badgeVariant
    switch (status) {
        case 'PROCESSED':
            badgeVariant = 'success'
            break;
        case 'FAILED':
            badgeVariant = 'danger'
            break;
        case 'PROCESSING':
            badgeVariant = 'info'
            break;
        case 'EMPTY_CONTENT':
            badgeVariant = 'dark'
            break;
        default:
        case 'PENDING':
            badgeVariant = 'secondary'
            break;
    }

    return (<Badge variant={badgeVariant}>
        {t(`badge.status.${status.toLowerCase()}`)}
    </Badge>)
}