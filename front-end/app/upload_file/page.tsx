'use client'
import { useData } from '@/utils/DataContext';

import { FileInput, FormGroup, Label, Button, Alert } from '@trussworks/react-uswds'
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SingleFileInput from '@/components/SingleFileInput/SingleFileInput';
import LinkAccordion from '@/components/LinkAccordion/LinkAccordion';



export default function UploadFile() {
  const process_url = 'ws://localhost:8080/process-ws'
  const [formData, setFormData] = useState({}); // State for form data
  const [progress, setProgress] = useState(0); // State for progress
  const [socket, setSocket] = useState(null);
  const fileInputRef = useRef(); // Define the ref
  const [file, setFile] = useState(null);

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
  } 
  const handleFileChange = (e: any) => {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
  };

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setProgress(data["progress"]);
    };

    ws.onclose = () => {
      // Handle WebSocket closed
    };

    setSocket(ws);

    return () => {
      ws.close(); // Close the WebSocket when the component unmounts
    };
  }, []);
    if(progress){
      return (
        {progress}
      )
    } else {
      return (
          <div>
            <h1 className='margin-bottom-1'>Upload your eCR</h1>
            <p>Select an eCR .zip file to process</p>
            <div className="usa-alert usa-alert--info margin-bottom-1">
              <div className="usa-alert__body">
                <p className="usa-alert__text">
                  This tool is only for test data. Please do not upload patient data to this site.
                </p>
              </div>
            </div>
              <FormGroup>
                  <Label htmlFor="file-input-single">Input accepts a single file</Label>
                  <FileInput 
                      id="file-input-single"
                      name="file-input-single"
                      onChange={(handleFileChange)}
                      className='width-lg margin-bottom-1'
                      itemRef='fileInputRef'
                  />
                  <Button type="button" onClick={handleSubmit}>Upload</Button>
              </FormGroup>
          </div>
      )
    }
}
