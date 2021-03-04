import React, { useState } from 'react'
import SearchBar from './SearchBar'
import DocumentsTable from './DocumentsTable'

export default function SearchPage() {
    const [isSearching, setSearching] = useState(false);
    const [doneSearch, setDoneSearch] = useState(false);
    const [docs, setDocs] = useState([]);

    const searchDocs = () => {
        setDoneSearch(false);
        setSearching(true);

        new Promise((resolve) => {
            let mockWaitingTime = Math.floor(Math.random() * 2000) + 500;
            console.log('Mocked request waiting time: ' + mockWaitingTime)
            setTimeout(resolve, mockWaitingTime)
        }).then(() => {
            let docs2 = [];
            for (let i = 0; i <= Math.floor(Math.random() * 100); i++)
                docs2.push(i)
            console.log('Mock documents length: ' + docs2.length);

            setDocs(docs2);
            setSearching(false);
            setDoneSearch(true);
        });
    }

    return (
        <div>
            <div className="d-flex flex-row align-item justify-content-center">
                <h1>UNIRIO GED App</h1>
            </div>
            <div className="d-flex flex-row align-item justify-content-center">
                <SearchBar isSearching={isSearching} onSearch={searchDocs} />
            </div>
            <div id="docsTable" className={`d-flex flex-row align-item justify-content-center ${doneSearch ? 'active' : ''}`}>
                <DocumentsTable documents={docs} />
            </div>
        </div>
    )
}
