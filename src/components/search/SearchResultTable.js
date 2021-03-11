import React from 'react'
import { Table } from 'react-bootstrap'
import '../../style/search/SearchResultTable.css'

export default function SearchResultTable({ documents }) {
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>File Name</th>
                    <th>Content</th>
                    <th>Registered By</th>
                    <th>Registered At</th>
                </tr>
            </thead>
            <tbody>
                {documents.map((item, index) => (
                    <tr key={item.id}>
                        <td>{index+1}</td>
                        <td>{item.title}</td>
                        <td>{item.fileName}</td>
                        <td>{item.content.substring(0, 50)}</td>
                        <td>{item.registeredBy}</td>
                        <td>{item.registeredAt}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    )
}
