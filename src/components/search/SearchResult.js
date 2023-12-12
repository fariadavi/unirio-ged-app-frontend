import React, { useContext, useState } from 'react'
import { UserContext } from '../../contexts/UserContext'
import { NotificationContext } from '../../contexts/NotificationContext'
import { NetworkContext } from '../../contexts/NetworkContext'
import { useTranslation } from 'react-i18next'
import { Icon } from '../util/CustomIcon'
import { Link } from 'react-router-dom'
import { faCircleNotch, faDownload, faEdit, faFilePdf, faFileAlt, faTrash, faFileExcel } from '@fortawesome/free-solid-svg-icons'
import StatusBadge from '../util/StatusBadge'
import '../../style/search/SearchResult.css'
import { NotificationType } from '../notification/Notifications'

const getFileIcon = mediaType => {
    switch (mediaType) {
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
            return faFileExcel;
        case 'application/pdf':
            return faFilePdf;
        default:
        case 'text/plain':
            return faFileAlt;
    }
}

const Actions = ({ item, deleteAction }) => {
    const { t } = useTranslation();
    const { user, checkPermission } = useContext(UserContext);
    const { pushNotification } = useContext(NotificationContext);
    const { rq } = useContext(NetworkContext);
    const [isLoading, setLoading] = useState(false);

    const getDocumentFile = async (docId, fileName, isDownload) => {
        const res = await rq(`/documents/${docId}/download`, { method: 'GET' });
        if (!res.ok) {
            pushNotification(NotificationType.ERROR, 'documents.actions.download.fail', { name: fileName });
            return;
        }

        const blob = await res.blob();
        var blobUrl = window.URL.createObjectURL(blob);

        if (isDownload) {
            const anchor = document.createElement('a');
            anchor.download = fileName;
            anchor.target = "_blank";
            anchor.href = blobUrl;
            anchor.click();
        } else {
            window.open(blobUrl, '_blank');
        }

        window.URL.revokeObjectURL(blobUrl);
    }

    return <div className="actions">
        {isLoading
            ? <Icon icon={faCircleNotch} className="faSpin" />
            : <>
                <span
                    onClick={() => {
                        if (!item.fileName?.length || item.mediaType !== 'application/pdf') return;
                        setLoading(true);
                        getDocumentFile(item.id, item.fileName, false).finally(() => setLoading(false))
                    }}
                    className={item.mediaType === 'application/pdf' ? '' : 'disabled'}
                >
                    <Icon icon={getFileIcon(item.mediaType)} tooltip={t('search.results.visualize.tooltip')} />
                </span>
                <span
                    onClick={() => {
                        if (!item.fileName?.length) return;
                        setLoading(true);
                        getDocumentFile(item.id, item.fileName, true).finally(() => setLoading(false))
                    }}
                    className={item.fileName.length ? '' : 'disabled'}
                >
                    <Icon icon={faDownload} tooltip={t('search.results.download.tooltip')} />
                </span>
                {(item.registeredById === user.id || checkPermission('EDIT_DOCS_OTHERS'))
                    && <Link to={`/documents/${item.id}`}>
                        <Icon icon={faEdit} tooltip={t('search.results.edit.tooltip')} />
                    </Link>}
                {(item.registeredById === user.id || checkPermission('DELETE_DOCS_OTHERS'))
                    && <span onClick={() => {
                        setLoading(true);
                        deleteAction(item).finally(() => setLoading(false));
                    }}>
                        <Icon icon={faTrash} tooltip={t('search.results.delete.tooltip')} />
                    </span>}
            </>}
    </div>
}

export default function SearchResult({ result, deleteDocument }) {
    const { t } = useTranslation();

    return (
        <div className="result">
            <p className="title">
                <span>{result.title}</span>
                <span><Actions item={result} deleteAction={deleteDocument} /></span>
            </p>
            <p className="subtitle">
                <span>{result.formattedDate}</span> | <span>{result.fullCategoryHierarchy}</span>
            </p>
            <p className="summary">{result.summary}</p>
            <p className="contentMatches" dangerouslySetInnerHTML={{ __html: result.searchMatches?.map(s2 => `<p>[...] ${s2}...</p>`).join('') }} />
            <p className="footer">
                <span>{t('search.results.createdBy')} {result.registeredBy} {t('search.results.createdAt')} {result.formattedRegisteredAt}</span>
                <span><StatusBadge status={result.status} /></span>
            </p>
        </div>
    );

}