import { Badge } from 'react-bootstrap'

export const getStatusBadge = status => {
    status = status || ''

    let badgeVariant
    switch (status) {
        case 'SUCCESS':
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
            badgeVariant = 'secondary'
            break;
    }

    return <Badge className="capitalize" bg={badgeVariant}>{status.toLowerCase()}</Badge>
}