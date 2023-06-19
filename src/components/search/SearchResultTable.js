import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import rq from '../../services/api'
import ReactTooltip from 'react-tooltip'
import TablePagination from '../util/TablePagination'
import StatusBadge from '../util/StatusBadge'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faEdit, faFilePdf, faFileAlt, faTrash } from '@fortawesome/free-solid-svg-icons'
import { faCaretSquareDown, faCaretSquareUp } from '@fortawesome/free-regular-svg-icons'
import '../../style/search/SearchResultTable.css'

const getWidth = () => window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;

function useCurrentWidth() {
    let [width, setWidth] = useState(getWidth());

    useEffect(() => {
        let lock = false;
        let timeoutId = null;
        const resizeListener = () => {
            if (!lock) {
                setWidth(getWidth());
                lock = true;
            }
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => { setWidth(getWidth()); lock = false }, 200);
        };
        window.addEventListener('resize', resizeListener);
        return () => window.removeEventListener('resize', resizeListener);
    }, []);

    return width;
}

export default function SearchResultTable({ refProp, documents, currentPage, numPages, deleteDocument, onSearch }) {
    const { t } = useTranslation();
    const [itemsRef, setItemsRef] = useState([]);
    const elementCallback = useCallback(el => el === null ? setItemsRef([]) : setItemsRef(itemsRef => [...itemsRef, el]), []);

    let width = useCurrentWidth();

    useEffect(() =>
        itemsRef.forEach(item => {
            let classList = item.parentElement.parentElement.parentElement.classList
            item.offsetHeight > 24 || item.offsetWidth < item.scrollWidth
                ? classList.add('expandable')
                : classList.remove('expandable');
        }), [itemsRef, width]);

    const expandRow = ref => {
        let classList = ref.parentElement.parentElement.parentElement.classList;
        classList.contains('expanded')
            ? classList.remove('expanded')
            : classList.add('expanded');
    }

    const getFileIcon = mediaType => {
        switch (mediaType) {
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
                    {documents.map((item, i) => (
                        <tr key={item.id} className="truncated">
                            <td className="actions">
                                <div className="center">
                                    <span
                                        onClick={() => item.mediaType === 'application/pdf' && getDocumentFile(item.id, item.fileName, false)}
                                        className={item.mediaType === 'application/pdf' ? '' : 'disabled'}
                                    >
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
                            <td className="title">
                                <span
                                    data-for={`tooltip_title_${item.id}`}
                                    data-tip={item.title}>
                                    <p>{item.title}</p>
                                    <ReactTooltip id={`tooltip_title_${item.id}`} />
                                </span>
                            </td>
                            <td className="summary">
                                <div>
                                    <p ref={elementCallback}>{item.summary}</p>
                                    <span className='expand-btn' onClick={() => expandRow(itemsRef[i])}>
                                        <FontAwesomeIcon className="icon expand-icon" icon={faCaretSquareUp} />
                                        <FontAwesomeIcon className="icon collapse-icon" icon={faCaretSquareDown} />
                                    </span>
                                </div>
                            </td>
                            <td className="category">
                                <span
                                    data-for={`tooltip_category_${item.id}`}
                                    data-tip={item.fullCategoryHierarchy}>
                                    <p className="center">{item.fullCategoryHierarchy}</p>
                                    <ReactTooltip id={`tooltip_category_${item.id}`} />
                                </span>
                            </td>
                            <td className="date"><p className="center">{item.formattedDate}</p></td>
                            <td className="status"><p className="center">{
                                <StatusBadge status={item.status} />
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