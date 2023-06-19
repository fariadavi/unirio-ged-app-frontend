import React from 'react'
import { useTranslation } from 'react-i18next'
import SearchResult from './SearchResult'
import TablePagination from '../util/TablePagination'
import '../../style/search/SearchResultList.css'

export default function SearchResultList({ refProp, results, totalResults, currentPage, numPages, deleteDocument, onSearch }) {
    const { t } = useTranslation();
    
    return (
        <div ref={refProp} className="search-results-box">
            <p className="search-results-info">
                {totalResults} {t('search.results.count')} - {t('search.results.page')} {currentPage} {t('search.results.page.of')} {numPages}
            </p>
            <div className="search-results">
                {results.map(item => <SearchResult result={item} deleteDocument={deleteDocument} />)}
                <TablePagination numPages={numPages} activePage={currentPage} onSearch={onSearch} centered />
            </div>
        </div>
    );
}