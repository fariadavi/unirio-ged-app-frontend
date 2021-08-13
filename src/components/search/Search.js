import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import rq from '../../services/api'
import SearchBar from './SearchBar'
import SearchResultTable from './SearchResultTable'
import '../../style/search/Search.css'

export default function Search() {
    const { t } = useTranslation();
    const [isSearching, setSearching] = useState(null);
    const [isSearchSuccess, setSearchSuccess] = useState(false);
    const [docs, setDocs] = useState([]);
    const [currentQuery, setCurrentQuery] = useState('');
    const [currentQueryString, setCurrentQueryString] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(5);
    const [totalResults, setTotalResults] = useState(0);

    const searchDocs = (queryString, filters) => {
        setCurrentQueryString(queryString);
        setSearchSuccess(false);
        setSearching(true);
        
        let url = '/documents/search?';
        for (const filter in filters) {
            let value = filters[filter];
            if (!!value)
                url += `${filter}=${encodeURI(value)}&`;
        }
        url += `q=${encodeURI(queryString)}`;

        rq(url, { method: "GET" }
        ).then(res => { if (res.ok) { setSearchSuccess(true); setCurrentQuery(url); return res.json() } else { window.alert('Error searching documents') } }
        ).then(result => { if (result) { setCurrentPage(result.page || 0); setTotalResults(result.totalHits|| 0); setDocs(result.results || []) }}
        ).catch(err => { setSearchSuccess(false); window.alert(t('search.error')); }
        ).finally(() => setSearching(false));
    }

    const searchPage = page => {
        setSearchSuccess(false);
        setSearching(true);

        rq(`${currentQuery}&page=${page}&pageSize=${pageSize}`, { method: "GET" }
        ).then(res => { if (res.ok) { setSearchSuccess(true); return res.json() } else { window.alert('Error searching documents') }}
        ).then(result => {if (result) { setCurrentPage(result.page || 0); setTotalResults(result.totalHits || 0); setDocs(result.results || []) }}
        ).catch(err => { setSearchSuccess(false); window.alert(t('search.error')); }
        ).finally(() => setSearching(false));
    }

    const handleDelete = docId => {
        rq(`/documents/${docId}`, { method: 'DELETE' })
        .then(res => { 
            if (!res.ok) return
            window.alert(`Document '${docId}' deleted`)
            setDocs(docs.filter(x => x.id !== docId))
        });
    }

    return (
        <div className="search">
            <div className="d-flex align-item justify-content-center searchBox">
                <h1 style={{ userSelect: 'none' }}>UNIRIO GED App</h1>
            </div>
            <div className="d-flex align-item justify-content-center searchBox">
                <SearchBar isSearching={isSearching} onSearch={searchDocs} />
            </div>
            <div id="docsTable" className={`d-flex align-item justify-content-center searchBox ${isSearching !== null ? 'active' : ''}`}>
            {!isSearching && isSearchSuccess && docs.length
                ? <SearchResultTable documents={docs} currentPage={currentPage} numPages={Math.ceil(totalResults/pageSize)} deleteDocument={handleDelete} onSearch={searchPage} />
                : (!isSearching && isSearchSuccess && !docs.length) || (!isSearching && !isSearchSuccess)
                    ? <div style={{ width: "100%", maxWidth: "900px" }}>
                        <p>
                            {t('search.noResultFound.message.p1')}
                            {currentQueryString.length ? t('search.noResultFound.message.p2') : ''}
                            <b style={{ display: currentQueryString.length ? 'inline-block' : 'none'}}>{currentQueryString}</b>
                            {t('search.noResultFound.message.p3')}
                        </p>
                        <div>
                            <p style={{ marginBottom: 0 }}>{t('search.noResultFound.searchTips.title')}</p>
                            <ul>
                                <li>{t('search.noResultFound.searchTips.item1')}</li>
                                <li>{t('search.noResultFound.searchTips.item2')}</li>
                                <li>{t('search.noResultFound.searchTips.item3')}</li>
                                <li>{t('search.noResultFound.searchTips.item4')}</li>
                            </ul>
                        </div>
                    </div>
                    : ''
            }
            </div>
        </div>
    )
}
