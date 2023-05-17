import React from 'react'
import { useTranslation } from 'react-i18next'
import rq from '../../services/api'
import TablePagination from '../util/TablePagination'
import StatusBadge from '../util/StatusBadge'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faEdit, faFilePdf, faFileAlt, faTrash } from '@fortawesome/free-solid-svg-icons'
import { faCaretSquareDown, faCaretSquareUp } from '@fortawesome/free-regular-svg-icons'
import '../../style/search/SearchResultTable.css'

export default function SearchResultTable({ refProp, documents, currentPage, numPages, deleteDocument, onSearch, expandResult }) {
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
        <div ref={refProp} className="docs-table">
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th><div className="center">{t('table.actions')}</div></th>
                        <th><div className="center">{t('document.title')}</div></th>
                        <th><div className="center">{t('document.summary')}</div></th>
                        <th><div className="center">{t('document.category')}</div></th>
                        <th><div className="center">{t('document.date')}</div></th>
                        <th><div className="center">{t('document.status')}</div></th>
                        <th><div className="center">{t('document.registeredBy')}</div></th>
                    </tr>
                </thead>
                <tbody>
                    {documents.map(item => (
                        <tr key={item.id} className={item['expand'] ? '' : 'truncated'}>
                            <td className="actions">
                                <div className="center">
                                    <span onClick={() => expandResult(item.id)}>
                                        <FontAwesomeIcon className="icon" icon={item['expand'] ? faCaretSquareUp : faCaretSquareDown} />
                                    </span>
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
                            <td className="title"><p>{item.title}</p></td>
                            <td className="summary"><p>{item.summary}</p>
                            </td>
                            <td className="category"><p className="center">{item.fullCategoryHierarchy}</p></td>
                            <td className="date"><p className="center">{item.formattedDate}</p></td>
                            <td className="status"><p className="center">{
                                    <StatusBadge status={item.status}/>
                            }</p></td>
                            <td className="user"><p className="center">{item.registeredBy}</p></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <TablePagination numPages={numPages} activePage={currentPage} onSearch={onSearch} />
        </div>
    )
}