'use client'
import { useData } from '@/utils/DataContext';

import { FileInput, FormGroup, Label, Button, Alert } from '@trussworks/react-uswds'
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SingleFileInput from '@/components/SingleFileInput/SingleFileInput';
import LinkAccordion from '@/components/LinkAccordion/LinkAccordion';
import * as changeCase from "change-case";
import { v4 } from 'uuid';

export default function UploadFile() {
  const router = useRouter();
  const url = 'ws://localhost:8080/process-ws'
  const [formData, setFormData] = useState({}); // State for form data
  const [progress, setProgress] = useState(""); // State for progress
  const [socket, setSocket] = useState(null);
  const fileInputRef = useRef(); // Define the ref
  const [file, setFile] = useState({name: ''});

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
      console.log('new message')
      // const data = JSON.parse(event.data);
      // console.log(data)
      setProgress(event.data);
    };

    ws.onclose = () => {
      // Handle WebSocket closed
    };

    setSocket(ws);

    return () => {
      ws.close(); // Close the WebSocket when the component unmounts
    };
  }, []);


  const stepHtml = (data: any) => {
      let html: any[] = []
      if(data["steps"]){
        data["steps"].forEach((step: any )=> {
          let stub = step["endpoint"].split('/').pop();
          let complete = ""
          let serviceName = changeCase.sentenceCase(step["service"])
            .replace("Fhir", "FHIR")
          if(stub){
            complete = isComplete(step, data) ? 
              "usa-step-indicator__segment--complete" : "";
          }
          html.push(
            <li className={'usa-step-indicator__segment ' + complete} key={v4()}>
              <span className="usa-step-indicator__segment-label">{serviceName}<span className="usa-sr-only">${complete ? "complete" : ""}</span></span>
            </li>
          )
        });
      }
      return html;
  }

  const isComplete = (step: any, data: any) => {
    let stub = step["endpoint"].split('/').pop();
    return data[stub] && data[stub]["status_code"] == 200 
  }

  const checkComplete = (data: any) => {
    if(!data || !data['steps']){
      return false;
    }
    for(let step of data["steps"]){
      if(!isComplete(step, data)){
        console.log('step', false)
        return false;
      }
    };
    console.log('complete', true)
    return true
  }

  const progressHtml = () =>{
    let progressJSON = JSON.parse(progress);
    let complete = checkComplete(progressJSON)
    return (
      <>
        <h1>Processing your eCR</h1>
        <p>
          View the progress of your eCR through our pipeline
        </p>
        <div className="usa-alert usa-alert--warning">
          <div className="usa-alert__body">
            <h4 className="usa-alert__heading">Your eCR is still processing</h4>
            <p className="usa-alert__text">
              We are processing the file you uploaded ({file["name"] ? file["name"] : ''}). Click the 'Cancel' button to process a different file.
            </p>
          </div>
        </div>
        <div className="usa-step-indicator usa-step-indicator--counters margin-top-3" aria-label="progress">
          <ol className="usa-step-indicator__segments">
            {stepHtml(progressJSON)}
          </ol>
        </div>
        <div className='margin-top-4'>
          <button type="button" className="usa-button--outline usa-button" onClick={()=>location.reload()}>Cancel</button>
          <button
            type="button"
            className="usa-button"
            onClick={()=>location.reload()}
            disabled={checkComplete(progressJSON) ? false : true}
          >
            Continue
          </button>
        </div>
      </>
    )
  }
    if(progress){
      return progressHtml()
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
