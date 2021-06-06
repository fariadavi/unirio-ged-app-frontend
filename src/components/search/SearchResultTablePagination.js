import React, { useEffect, useState } from 'react'
import { Pagination } from 'react-bootstrap'

export default function SearchResultTablePagination({ numPages, activePage, onSearch }) {
    const [paginationItems, setPaginationItems] = useState([]);

    useEffect(() => {
        let items = []

        let minPagePagination = activePage - 2;
        let maxPagePagination = activePage + 2;
    
        if (maxPagePagination > numPages) {
            maxPagePagination = numPages;
            minPagePagination = numPages - 4;
        }

        if (minPagePagination <= 1)
            minPagePagination = 1;
         
        items.push(<Pagination.First key={'first'} onClick={() => onSearch(1)} disabled={activePage === 1} />)
        items.push(<Pagination.Prev key={'-'} onClick={() => onSearch(activePage-1)} disabled={activePage === 1}/>)
        
        for (let pageNum = minPagePagination; pageNum <= maxPagePagination; pageNum++) {
            items.push(
                <Pagination.Item key={pageNum} onClick={() => { if (pageNum === activePage) return; onSearch(pageNum) }} active={pageNum === activePage}>
                    {pageNum}
                </Pagination.Item>
            );
        }
         
        items.push(<Pagination.Next key={'+'} onClick={() => onSearch(activePage+1)} disabled={activePage === numPages} />)
        items.push(<Pagination.Last key={'last'} onClick={() => onSearch(numPages)} disabled={activePage === numPages}/>)

        setPaginationItems(items);
    }, [numPages, activePage, onSearch]);

    return (
        <Pagination className="tablePagination justify-content-end">
            {paginationItems}
        </Pagination>
    );
}