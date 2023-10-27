'use client'
import { useData } from '@/utils/DataContext';
import { FileInput, FormGroup, Alert, Button } from '@trussworks/react-uswds'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SingleFileInput from '@/components/SingleFileInput/SingleFileInput';
import LinkAccordion from '@/components/LinkAccordion/LinkAccordion';



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
                router.push('/export')
            } catch (error) {
                console.error('Error uploading file', error);
            }
        }
    };

    const test = () => {
        return (
            <div className="usa-accordion">
                <button
                    type="button"
                    className="usa-accordion__button usa-banner__button"
                    aria-expanded="false"
                    aria-controls="gov-banner-default-default"
                >
                    <span className="usa-banner__button-text">Here’s how you know</span>
                </button>
                <div
                    className="usa-accordion__content"
                    id="gov-banner-default-default"
                >
                    <div>Hi</div>
                </div>
            </div>
        )
    }

    return (
        <div className="margin-3">
            <h1 className='font-sans-xl text-bold'>Upload your eCR</h1>
            <p className="font-sans-lg text-light">Select an eCR .zip file to process</p>
            <div className="usa-alert usa-alert--info usa-alert--no-icon maxw-tablet">
                <div className="usa-alert__body padding-0">
                    <p className="usa-alert__text font-sans-xs text-bold">
                        This tool is only for test data. Please do not upload patient data to this site.
                    </p>
                </div>
            </div>
            <FormGroup>
                <FileInput id="file-input-single"
                    name="file-input-single" onChange={(addFile)}
                />
                <div className="margin-top-205">
                    <LinkAccordion></LinkAccordion>
                </div>
                <Button className="margin-top-3" disabled={!file} type="button" onClick={handleSubmit}>Continue</Button>
            </FormGroup>
        </div>
    )
}
