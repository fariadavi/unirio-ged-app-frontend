import React from 'react'
import { Table } from 'react-bootstrap'
import './style/DocumentsTable.css'

export default function DocumentsTable({ documents }) {
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>#</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Username</th>
                </tr>
            </thead>
            <tbody>
                {documents.map(item => (
                    <tr key={item}>
                        <td>1</td>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>@mdo</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    )
}
