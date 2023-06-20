import React from 'react'
import { useTranslation } from 'react-i18next'
import rq from '../../services/api'
import { Icon } from '../util/CustomIcon'
import { Link } from 'react-router-dom'
import { faDownload, faEdit, faFilePdf, faFileAlt, faTrash, faFileExcel } from '@fortawesome/free-solid-svg-icons'
import StatusBadge from '../util/StatusBadge'
import '../../style/search/SearchResult.css'

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

const getDocumentFile = (docId, fileName, isDownload) => {
    rq(`/documents/${docId}/download`, { method: 'GET' })
        .then(res => { if (res.ok) return res.blob(); })
        .then(blob => {
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
        })
}

const Actions = ({ item, deleteAction }) => {
    const { t } = useTranslation();

    return <div className="actions">
        <span
            onClick={() => item.mediaType === 'application/pdf' && getDocumentFile(item.id, item.fileName, false)}
            className={item.mediaType === 'application/pdf' ? '' : 'disabled'}
        >
            <Icon icon={getFileIcon(item.mediaType)} tooltip={t('search.results.visualize.tooltip')} />
        </span>
        <span onClick={() => getDocumentFile(item.id, item.fileName, true)}>
            <Icon icon={faDownload} tooltip={t('search.results.download.tooltip')} />
        </span>
        <Link to={`/documents/${item.id}`}>
            <Icon icon={faEdit} tooltip={t('search.results.edit.tooltip')} />
        </Link>
        <span onClick={() => deleteAction(item.id)}>
            <Icon icon={faTrash} tooltip={t('search.results.delete.tooltip')} />
        </span>
    </div>
}

export default function SearchResult({ key, result, deleteDocument }) {
    const { t } = useTranslation();

    return (
        <div className="result" key={key}>
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