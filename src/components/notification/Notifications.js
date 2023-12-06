import React, { useContext, useState } from 'react'
import { NotificationContext } from '../../contexts/NotificationContext'
import { useTranslation } from 'react-i18next'
import { Toast } from 'react-bootstrap'
import '../../style/utils/Notification.css'
import { Icon } from '../util/CustomIcon'
import { faCheckCircle, faExclamationTriangle, faInfoCircle } from '@fortawesome/free-solid-svg-icons'

export const NotificationType = {
    SUCCESS: 'Success',
    WARNING: 'Warning',
    ERROR: 'Error',
    INFO: 'Info'
};

const getNotificationIcon = type => {
    switch (type) {
        default:
        case NotificationType.SUCCESS:
            return faCheckCircle;
        case NotificationType.WARNING:
        case NotificationType.ERROR:
            return faExclamationTriangle;
        case NotificationType.INFO:
            return faInfoCircle;
    }
}

export const Notification = ({ id, header, body, type = NotificationType.SUCCESS }) => {
    const { t } = useTranslation();
    const [showToast, setShowToast] = useState(true);
    const { removeNotification } = useContext(NotificationContext);

    return <Toast
        show={showToast}
        onClose={() => {
            setShowToast(show => !show);
            setTimeout(() => removeNotification(id), 200);
        }}
        delay={3000}
        className={`notification notification${type}`}
        autohide
    >
        <Toast.Header>
            <span><Icon icon={getNotificationIcon(type)} /></span>
            <strong className="toast-title mr-auto">
                {t(header || `notifications.header.default.${type.toLowerCase()}`)}
            </strong>
        </Toast.Header>
        {body && body.message
            ? <Toast.Body>{t(body.message, body.params)}</Toast.Body>
            : <></>}
    </Toast>
}

export const NotificationList = () => {
    const { notifications } = useContext(NotificationContext);

    return <div className="notification-list">
        {notifications
            .map(notification =>
                <Notification
                    key={notification.id}
                    id={notification.id}
                    header={notification.header}
                    body={notification.body}
                    type={notification.type}
                />
            )}
    </div>
}