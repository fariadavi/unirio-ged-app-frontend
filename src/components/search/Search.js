import React, { useContext, useEffect, useRef, useState } from 'react'
import { UserContext } from '../../contexts/UserContext'
import { NotificationContext } from '../../contexts/NotificationContext'
import rq from '../../services/api'
import AppTitle from '../util/AppTitle'
import SearchBar from './SearchBar'
import SearchResultList from './SearchResultList'
import NoResultMessage from './NoResultMessage'
import { NotificationType } from '../notification/Notifications'
import '../../style/search/Search.css'

export default function Search() {
    const tableRef = useRef(null);
    const { checkPermission, department } = useContext(UserContext);
    const { pushNotification } = useContext(NotificationContext);
    const [canSearchDocs] = useState(checkPermission('SEARCH_DOCS'));
    const [isSearching, setSearching] = useState(false);
    const [isSearchSuccess, setSearchSuccess] = useState(false);
    const [docs, setDocs] = useState([]);
    const [currentQuery, setCurrentQuery] = useState('');
    const [currentQueryString, setCurrentQueryString] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalResults, setTotalResults] = useState(0);

    const searchDocs = (queryString, filters) => {
        setCurrentQueryString(queryString);
        setSearching(true);

        let url = '/documents/search?';
        for (const filter in filters) {
            let value = filters[filter];
            if (!!value)
                url += `${filter}=${encodeURI(value)}&`;
        }
        url += `q=${encodeURI(queryString)}`;

        rq(url, { method: "GET" }
        ).then(res => { if (res.ok) { setCurrentQuery(url); return res.json() } else { pushNotification(NotificationType.ERROR, 'search.error'); } }
        ).then(result => {
            if (result) {
                setCurrentPage(result.page || 0);
                setTotalResults(result.totalHits || 0);
                setDocs(result.results || []);
                setSearchSuccess(true);
            }
        }
        ).catch(err => { setSearchSuccess(false); pushNotification(NotificationType.ERROR, 'search.error'); }
        ).finally(() => setSearching(false));
    }

    const searchPage = page => {
        setSearching(true);

        rq(`${currentQuery}&page=${page}&pageSize=${pageSize}`, { method: "GET" }
        ).then(res => { if (res.ok) { return res.json() } else { pushNotification(NotificationType.ERROR, 'search.error'); } }
        ).then(result => {
            if (result) {
                setCurrentPage(result.page || 0);
                setTotalResults(result.totalHits || 0);
                setDocs(result.results || []);
                setSearchSuccess(true);

                if (result.totalHits)
                    tableRef.current.scrollIntoView({ block: 'start', behavior: 'smooth' });
            }
        }
        ).catch(err => { setSearchSuccess(false); pushNotification(NotificationType.ERROR, 'search.error'); }
        ).finally(() => setSearching(false));
    }

    const handleDelete = async docId => {
        try {
            const res = await rq(`/documents/${docId}`, { method: 'DELETE' });
            if (!res.ok) {
                pushNotification(NotificationType.ERROR, 'document.actions.delete.fail', { id: docId });
                return; 
            }
    
            pushNotification(NotificationType.SUCCESS, 'document.actions.delete.success', { id: docId });
    
            setDocs(docs.filter(x => x.id !== docId));
        } catch (e) {
            pushNotification(NotificationType.ERROR, 'document.actions.delete.fail', { id: docId });
        }
    }

    useEffect(() => { setDocs([]); setSearching(null); setSearchSuccess(false); }, [department]);

    return (
        <div className="search-page">
            <div ref={tableRef} className={`search-result ${isSearchSuccess ? 'active' : ''}`}>
                {canSearchDocs &&
                    <div>
                        {isSearchSuccess && docs.length
                            ? <SearchResultList
                                results={docs}
                                totalResults={totalResults}
                                currentPage={currentPage}
                                numPages={Math.ceil(totalResults / pageSize)}
                                deleteDocument={handleDelete}
                                onSearch={searchPage}
                            />
                            : isSearchSuccess && !docs.length &&
                            <NoResultMessage currentQueryString={currentQueryString} />
                        }
                    </div>
                }
            </div>
            <div className="search-bar">
                {canSearchDocs && <SearchBar isSearching={isSearching} onSearch={searchDocs} />}
            </div>
            <div className="search-header">
                <AppTitle />
            </div>
        </div>
    )
}