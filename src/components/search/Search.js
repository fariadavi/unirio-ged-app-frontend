import React, { useState } from 'react'
import rq from '../../services/api'
import SearchBar from './SearchBar'
import SearchResultTable from './SearchResultTable'
import '../../style/search/Search.css'

export default function Search() {
    const [isSearching, setSearching] = useState(false);
    const [isSearchSuccess, setSearchSuccess] = useState(false);
    const [docs, setDocs] = useState([]);

    const searchDocs = (query) => {
        setSearchSuccess(false);
        setSearching(true);
        
        rq(`/documents/search?q=${encodeURI(query)}`, { method: "GET" }
        ).then(res => { if (res.ok) { setSearchSuccess(true); return res.json() }}
        ).then(documents => setDocs(documents || [])
        ).finally(() => setSearching(false));
    }

    return (
        <div className="search">
            <div className="d-flex flex-row align-item justify-content-center searchBox">
                <h1 style={{ userSelect: 'none' }}>UNIRIO GED App</h1>
            </div>
            <div className="d-flex flex-row align-item justify-content-center searchBox">
                <SearchBar isSearching={isSearching} onSearch={searchDocs} />
            </div>
            <div id="docsTable" className={`d-flex flex-row align-item justify-content-center searchBox ${isSearchSuccess && !isSearching ? 'active' : ''}`}>
                <SearchResultTable documents={docs} />
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
