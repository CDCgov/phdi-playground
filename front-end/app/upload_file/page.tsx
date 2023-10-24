'use client'
import { useData } from '@/utils/DataContext';
import { FileInput, FormGroup, Label, Button } from '@trussworks/react-uswds'
import { useState } from 'react';
import { useRouter } from 'next/navigation';


export default function UploadFile() {
    const { setData } = useData();
    const router = useRouter();
    // We will change this and put it in a constants 
    // file when orchestration is published
    const process_url = 'http://localhost:8080/process'
    const [file, setFile] = useState<File | null>(null);
    const addFile = (event: React.ChangeEvent<HTMLInputElement>): void => {
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
                setData(data);
                //We will do something with the data high fidelity version.
                console.log(data);
                router.push('/export')
            } catch (error) {
                console.error('Error uploading file', error);
            }
        }
    };

    return (
        <div className="margin-3">
            <FormGroup>
                <Label htmlFor="file-input-single">Input accepts a single file</Label>
                <FileInput id="file-input-single"
                    name="file-input-single" onChange={(addFile)}
                />
                <Button type="button" onClick={handleSubmit}>Upload</Button>
            </FormGroup>
        </div>
    )
}
