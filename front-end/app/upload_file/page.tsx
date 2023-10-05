'use client'
import { FileInput, FormGroup, Label, Button } from '@trussworks/react-uswds'
import { useState } from 'react';


export default function UploadFile() {
    const process_url = 'http://localhost:8080/process'
    const [file, setFile] = useState(null);
    const addFile = (event: any): void => {
        setFile(event.target.files[0]);
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (file) {
            const formData = new FormData();
            formData.append('upload_file', file);
            formData.append('message_type', 'ecr');
            formData.append('include_error_types', 'errors');
            console.log('i am here')
            try {
                const response = await fetch(process_url, {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();
                console.log(data);
            } catch (error) {
                console.error('Error uploading file', error);
            }
        }
    };

    const uploadFile = (e: any): void => {
        console.log(file)
    }

    return <div className="margin-3">
        <FormGroup>
            <Label htmlFor="file-input-single">Input accepts a single file</Label>
            <FileInput id="file-input-single" name="file-input-single" onChange={(addFile)} />
            <Button type="button" onClick={handleSubmit}>Upload</Button>
        </FormGroup>
    </div>
}
