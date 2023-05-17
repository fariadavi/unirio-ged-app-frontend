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
        default:
        case 'NOT_PROCESSED':
        case 'EMPTY_CONTENT':
            badgeVariant = 'secondary'
            break;
    }

    return (<Badge className="capitalize" variant={badgeVariant}>
        {t(`badge.status.${status.toLowerCase()}`)}
    </Badge>)
}