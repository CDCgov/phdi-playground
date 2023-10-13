'use client'
import { FileInput, FormGroup, Label, Button } from '@trussworks/react-uswds'
import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import SingleFileInput from '../components/SingleInput';


export default function UploadFile() {
    // We will change this and put it in a constants 
    // file when orchestration is published
    const process_url = 'http://localhost:8080/process'
    const [file, setFile] = useState<File | null>(null);
    const addFile = (event: React.ChangeEvent<HTMLInputElement>): void => {
        console.log(event)
        setFile(event.target.files?.item(0) || null);
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (file) {
            const formData = new FormData();
            formData.append('upload_file', file);
            formData.append('message_type', 'ecr');
            formData.append('include_error_types', 'errors');
            try {
                const response = await fetch(process_url, {
                    method: 'POST',
                    body: formData,
                });
                const data = await response.json();
                //We will do something with the data high fidelity version.
                console.log(data);
            } catch (error) {
                console.error('Error uploading file', error);
            }
        }
    };

    return <div className="margin-3">
        <SingleFileInput
            id="upload-patients-file-input"
            name="upload-patients-file-input"
            ariaLabel="Choose CSV file"
            ariaInvalid={false}
            required
            onChange={addFile}
        />
        {/* <FormGroup>
            <Label htmlFor="file-input-single">Input accepts a single file</Label>
            <FileInput id="file-input-single" name="file-input-single" />
        </FormGroup> */}
        {/* <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Default file input example</Form.Label>
            <Form.Control type="file" />
        </Form.Group> */}
    </div>
}
