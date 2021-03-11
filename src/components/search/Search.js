import React, { useState } from 'react'
import rq from '../../services/api'
import SearchBar from './SearchBar'
import SearchResultTable from './SearchResultTable'
import '../../style/search/Search.css'

export default function Search() {
    const [isSearching, setSearching] = useState(false);
    const [doneSearch, setDoneSearch] = useState(false);
    const [docs, setDocs] = useState([]);

    const searchDocs = (query) => {
        setDoneSearch(false);
        setSearching(true);
        
        rq(`/documents/search?q=${encodeURI(query)}`, { method: "GET" }).then(res => {
            return res.json()
        }).then(documents => {
            console.log(documents);
            setDocs(documents);
            setSearching(false);
            setDoneSearch(true);
        });
    }

    return (
        <div className="search">
            <div className="d-flex flex-row align-item justify-content-center searchBox">
                <h1>UNIRIO GED App</h1>
            </div>
            <div className="d-flex flex-row align-item justify-content-center searchBox">
                <SearchBar isSearching={isSearching} onSearch={searchDocs} />
            </div>
            <div id="docsTable" className={`d-flex flex-row align-item justify-content-center searchBox ${doneSearch ? 'active' : ''}`}>
                <SearchResultTable documents={docs} />
            </div>
        </div>
    )
}
