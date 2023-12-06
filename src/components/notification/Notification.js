import React, { useContext, useState } from 'react'
import { NotificationContext } from '../../contexts/NotificationContext'
import { useTranslation } from 'react-i18next'
import { Toast } from 'react-bootstrap'
import '../../style/utils/Notification.css'

const Notification = ({ id, header = 'notifications.header.default', body }) => {
    const { t } = useTranslation();
    const [showToast, setShowToast] = useState(true);
    const { removeNotification } = useContext(NotificationContext);

    return <Toast
        show={showToast}
        onClose={() => {
            setShowToast(show => !show);
            setTimeout(() => removeNotification(id), 200);
        }}
        delay={5000}
        className="notification"
        autohide
    >
        <Toast.Header>
            <strong className="mr-auto">{t(header)}</strong>
        </Toast.Header>
        {body
            ? <Toast.Body>{t(body)}</Toast.Body>
            : <></>}
    </Toast>
}

export default Notification;
