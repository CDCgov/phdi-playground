'use client'
import {
    Modal,
    ButtonGroup,
    ModalFooter,
    ModalHeading,
    ModalToggleButton,
    ModalRef,
    Select,
    Label,
    Table
} from '@trussworks/react-uswds'
import React, { useRef } from 'react'

export default function ecrViewer() {
    const modalRef = useRef<ModalRef>(null)
    const options = []
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
                {ExportModal()}
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

function ExportModal() {
    const modalRef = useRef<ModalRef>(null)
    return (
        <>
            <ModalToggleButton modalRef={modalRef} opener>
                Export
            </ModalToggleButton>
            <Modal
                ref={modalRef}
                id="example-modal-1"
                aria-labelledby="modal-1-heading"
                aria-describedby="modal-1-description">
                <ModalHeading id="modal-1-heading">
                    Export eCR Data
                </ModalHeading>
                <div>
                    <Label htmlFor="input-select">Select a file format</Label>
                    <Select
                        id="input-select"
                        name="input-select"
                    >
                        <React.Fragment key=".0">
                            <option>
                                - Select -{' '}
                            </option>
                            <option value="value1">
                                .csv
                            </option>
                            <option value="value2">
                                .parquet
                            </option>
                            <option value="value3">
                                .txt
                            </option>
                        </React.Fragment>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="input-select">Select a data format</Label>
                    <Select
                        id="input-select"
                        name="input-select"
                    >
                        <React.Fragment key=".0">
                            <option>
                                - Select -{' '}
                            </option>
                            <option value="value1">
                                FHIR
                            </option>
                            <option value="value2">
                                XML
                            </option>
                            <option value="value3">
                                .txt
                            </option>
                        </React.Fragment>
                    </Select>
                </div>
                <ModalFooter>
                    <ButtonGroup>
                        <ModalToggleButton modalRef={modalRef} closer>
                            Download
                        </ModalToggleButton>
                        <ModalToggleButton
                            modalRef={modalRef}
                            closer
                            unstyled
                            className="padding-105 text-center">
                            Go back
                        </ModalToggleButton>
                    </ButtonGroup>
                </ModalFooter>
            </Modal>
        </>
    )
}
