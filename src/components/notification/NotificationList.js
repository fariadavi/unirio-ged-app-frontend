import React, { useContext } from 'react'
import { NotificationContext } from '../../contexts/NotificationContext'
import Notification from './Notification'

const NotificationList = () => {
    const { notifications } = useContext(NotificationContext);

    return <div className="notification-list">
        {notifications
            .map(notification =>
                <Notification
                    key={notification.id}
                    id={notification.id}
                    header={notification.header}
                    body={notification.body}
                />
            )}
    </div>
}

export default NotificationList;