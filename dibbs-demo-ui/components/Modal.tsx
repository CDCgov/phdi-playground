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
import React, { useRef, useEffect } from 'react'
import dynamic from 'next/dynamic';

const ExportModal = () => {
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
};

export default dynamic(() => Promise.resolve(ExportModal), {
    ssr: false,
});


