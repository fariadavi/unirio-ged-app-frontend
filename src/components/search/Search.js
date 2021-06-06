import React, { useState } from 'react'
import rq from '../../services/api'
import SearchBar from './SearchBar'
import SearchResultTable from './SearchResultTable'
import '../../style/search/Search.css'

export default function Search() {
    const [isSearching, setSearching] = useState(false);
    const [isSearchSuccess, setSearchSuccess] = useState(false);
    const [docs, setDocs] = useState([]);
    const [currentQuery, setCurrentQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(2);
    const [totalResults, setTotalResults] = useState(0);

    const searchDocs = (queryString, filters) => {
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
        ).then(res => { if (res.ok) { setSearchSuccess(true); setCurrentQuery(url); return res.json() }}
        ).then(result => { setCurrentPage(result.page); setTotalResults(result.totalHits);  setDocs(result.results || []) }
        ).finally(() => setSearching(false));
    }

    const searchPage = (page) => {
        setSearchSuccess(false);
        setSearching(true);

        rq(`${currentQuery}&page=${page}&pageSize=${pageSize}`, { method: "GET" }
        ).then(res => { if (res.ok) { setSearchSuccess(true); return res.json() }}
        ).then(result => { setCurrentPage(result.page); setTotalResults(result.totalHits); setDocs(result.results || []) }
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
            <div id="docsTable" className={`d-flex flex-column align-item justify-content-center searchBox ${isSearchSuccess && !isSearching ? 'active' : ''}`}>
                <SearchResultTable documents={docs} currentPage={currentPage} numPages={Math.ceil(totalResults/pageSize)} deleteDocument={handleDelete} onSearch={searchPage} />
                {/* if      !searching and isSearchSuccess and docs.length
                        exibir tabela
                    else if !searching and isSearchSuccess and !docs.length
                        msg: nenhum resultado encontrado
                    else if !searching and !isSearchSuccess
                        msg: erro ao realizar busca
                */}
            </div>
        </div>
    )
}
