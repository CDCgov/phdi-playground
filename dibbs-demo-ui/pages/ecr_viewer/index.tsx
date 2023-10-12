import {
    Table
} from '@trussworks/react-uswds'
import ExportModal from '@/components/Modal'
import React, { useRef } from 'react'

export default function ECRViewer() {
    const data = [
        {
            document_title: 'Declaration of Independence',
            year: '1776'
        },
        {
            document_title: 'Bill of Rights',
            year: '1791'
        },
        {
            document_title: 'Emancipation Proclamation',
            year: '1863'
        },
    ]

    const getTableBody = () => {
        return (
            <tbody>
                {data.map(function (data, i) {
                    return (
                        <tr key={data.document_title}>
                            <th scope="row">{data.document_title}</th>
                            <td>{data.year}</td>
                        </tr>
                    );
                })}
            </tbody>
        )
    }

    return (
        <div className='margin-3'>
            <h1>eCR Viewer</h1>
            <div>
                <ExportModal></ExportModal>
            </div>
            <div>
                <Table
                    bordered
                    caption="This table uses the fullWidth prop to increase to 100% width"
                    fullWidth>
                    <thead>
                        <tr>
                            <th scope="col">Document title</th>
                            <th scope="col">Year</th>
                        </tr>
                    </thead>
                    {getTableBody()}
                </Table>
            </div>
        </div>
    )
}

