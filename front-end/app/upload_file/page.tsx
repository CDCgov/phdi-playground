'use client'
import { FileInput, FormGroup, Button, ErrorMessage } from '@trussworks/react-uswds'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LinkAccordion from '@/components/LinkAccordion/LinkAccordion';
import { formatData, ProgressData, createWebSocket, stepHtml, alertHtml } from './utils'
import { useData } from '@/utils/DataContext';

export default function UploadFile() {
    const { setData } = useData();
    const router = useRouter();
    const url = process.env.NEXT_PUBLIC_PROCESS_URL ?? ""
    const [progress, setProgress] = useState<ProgressData | null>(null); // State for progress
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);

    const fileErrors = {
        size: "We can only accept .zip files smaller than 1GB",
        type: "We can only accept .zip files"
    }
    const fileSizeLimit = 1000000000; // 1 GB

    const handleSubmit = () => {
        // Send form data to the server via a WebSocket
        if (!file || !socket) {
            return 'false';
        }
        const formData = new FormData();
        formData.append("file", file);
        socket.send(file)
    };
    const addFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.item(0);
        if (selectedFile?.size && selectedFile.size > fileSizeLimit) {
            setFileError(fileErrors.size)
        }
        else if (!selectedFile?.name.toLowerCase().endsWith('.zip')) {
            setFileError(fileErrors.type)
        }
        else if (selectedFile) {
            setFileError(null);
            setFile(selectedFile);
        }
    };

    useEffect(() => {
        const ws = createWebSocket(url);
        ws.onmessage = (event) => {
            let data = formatData(event.data)
            if (data.complete && data["processed_values"]) {
                setData(data)
            } else {
                setProgress(formatData(event.data));
            }
        };

        ws.onclose = (event) => {
            // Handle WebSocket closed
        };

        setSocket(ws);

        return () => {
            ws.close(); // Close the WebSocket when the component unmounts
        };
    }, []);


  console.log("progress", progress)

  const progressComponent = () => {
        if (!progress || !file) {
            return (<></>)
        }
        return (
            <div className="display-flex flex-justify-center margin-top-5">
                <div className="max-611">
                    <h1 className='font-sans-xl text-bold margin-top'>Processing your eCR</h1>
                    <p className="font-sans-lg text-light">
                        View the progress of your eCR through our pipeline
                    </p>
                    {alertHtml(progress, file)}
                    <div
                        className="usa-step-indicator usa-step-indicator--counters margin-top-4"
                        aria-label="progress"
                    >
                        <ol className="usa-step-indicator__segments">
                            {stepHtml(progress)}
                        </ol>
                    </div>
                    <div className='margin-top-5'>
                        <button type="button" className="usa-button--outline usa-button" onClick={() => location.reload()}>Cancel</button>
                        <button
                            type="button"
                            className="usa-button"
                            onClick={() => router.push('/export')}
                            disabled={progress.complete ? false : true}
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </div>
        )
    }
    if (progress) {
        return progressComponent()
    } else {
        return (
            <div className="display-flex flex-justify-center margin-top-5">
                <div className="max-611">
                    <h1 className='font-sans-xl text-bold margin-top'>Upload your eCR</h1>
                    <p className="font-sans-lg text-light">Select an eCR .zip file to process</p>
                    <div className="usa-alert usa-alert--info usa-alert--no-icon maxw-tablet">
                        <div className="usa-alert__body padding-0">
                            <p className="usa-alert__text font-sans-xs text-bold">
                                This tool is only for test data. Please do not upload patient data to this site.
                            </p>
                        </div>
                    </div>
                    <FormGroup error={fileError ? true : false}>
                        {fileError &&
                            <ErrorMessage id="file-input-error-alert">
                                {fileError}
                            </ErrorMessage>
                        }

                        <FileInput id="file-input-single"
                            name="file-input-single" onChange={addFile}
                        />

                        <div className="margin-top-205">
                            <LinkAccordion></LinkAccordion>
                        </div>
                        <Button
                            className="margin-top-3"
                            disabled={!file || fileError !== null}
                            type="button"
                            onClick={handleSubmit}
                        >
                            Continue
                        </Button>
                    </FormGroup>
                </div>
            </div>
        )
    }
}
