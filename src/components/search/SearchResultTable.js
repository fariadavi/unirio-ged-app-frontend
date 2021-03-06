import React from 'react'
import { useTranslation } from 'react-i18next'
import rq from '../../services/api'
import SearchResultTablePagination from './SearchResultTablePagination'
import { getStatusBadge } from '../../components/badges/statusBadge'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faEdit, faFilePdf, faFileAlt, faTrash } from '@fortawesome/free-solid-svg-icons'
import '../../style/search/Search.css'

export default function SearchResultTable({ documents, currentPage, numPages, deleteDocument, onSearch }) {
    const { t } = useTranslation();

    const getFileIcon = mediaType => {
        switch(mediaType) {
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

    return (
        <>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th><div className="center">{t('table.actions')}</div></th>
                        <th width="15%"><div className="center">{t('document.title')}</div></th>
                        <th width="50%"><div className="center">{t('document.summary')}</div></th>
                        <th width="15%"><div className="center">{t('document.category')}</div></th>
                        <th><div className="center">{t('document.date')}</div></th>
                        <th><div className="center">{t('document.status')}</div></th>
                        <th><div className="center">{t('document.registeredBy')}</div></th>
                    </tr>
                </thead>
                <tbody>
                    {documents.map((item, index) => (
                        <tr key={item.id}>
                            <td>
                                <div className="actions center">
                                    <span onClick={() => getDocumentFile(item.id, item.fileName, false)}>
                                        <FontAwesomeIcon className="icon" icon={getFileIcon(item.mediaType)} />
                                    </span>
                                    <span onClick={() => getDocumentFile(item.id, item.fileName, true)}>
                                        <FontAwesomeIcon className="icon" icon={faDownload} />
                                    </span>
                                    <Link to={`/documents/${item.id}`}>
                                        <FontAwesomeIcon className="icon" icon={faEdit} />
                                    </Link>
                                    <span onClick={() => deleteDocument(item.id)}>
                                        <FontAwesomeIcon className="icon" icon={faTrash} />
                                    </span>
                                </div>
                            </td>
                            <td><div>{item.title}</div></td>
                            <td><div className="heightOverflow">{item.summary}</div></td>
                            <td><div className="center">{item.fullCategoryHierarchy}</div></td>
                            <td><div className="center">{item.formattedDate}</div></td>
                            <td><div className="center">{getStatusBadge(item.status)}</div></td>
                            <td><div className="center">{item.registeredBy}</div></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <SearchResultTablePagination numPages={numPages} activePage={currentPage} onSearch={onSearch} />
        </>
    )
}
