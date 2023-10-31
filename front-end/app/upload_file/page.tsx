'use client'
import { FileInput, FormGroup, Button } from '@trussworks/react-uswds'
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LinkAccordion from '@/components/LinkAccordion/LinkAccordion';
import * as changeCase from "change-case";
import { v4 } from 'uuid';
import {formatData, ProgressData, Step} from './utils'

export default function UploadFile() {
  const router = useRouter();
  const url = 'ws://localhost:8080/process-ws'
  const [formData, setFormData] = useState({}); // State for form data
  const [progress, setProgress] = useState<ProgressData | null>(null); // State for progress
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const fileInputRef = useRef(); // Define the ref
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = () => {
    // Send form data to the server via a WebSocket
    if(!file || !socket){
      return 'false';
    }
    const formData = new FormData();
    formData.append("file", file);
    
    socket.send(file)
  };
  const handleFileChange = (e: any) => {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
  };

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onmessage = (event) => {
      setProgress(formatData(event.data));
    };

    ws.onclose = () => {
      // Handle WebSocket closed
    };

    setSocket(ws);

    return () => {
      ws.close(); // Close the WebSocket when the component unmounts
    };
  }, []);

  const stepClass = (step: Step)=>{
      let classStr = ""
      classStr = step.progressState  === "complete" ? "usa-step-indicator__segment--complete" : "";
      classStr += step.progressState === "in-progress" ? 
        " usa-step-indicator-in-progress" : "";
      classStr += step.progressState !== 'incomplete' ? 
        ` ${step.iconClass}`: '';
      return classStr;
  }


  const stepHtml = (data: ProgressData) => {
      let html: any[] = []
      if(data.steps){
        data.steps.forEach((step: Step )=> {
          let classStr = stepClass(step)
          let serviceName = step.formalName ? step.formalName : 
            changeCase.sentenceCase(step.service).replace("Fhir", "FHIR")
          html.push(
            <li className={'usa-step-indicator__segment no-content ' + classStr} key={v4()}>
              <span className="usa-step-indicator__segment-label">{serviceName}
                <span className="usa-sr-only">${step.complete ? "complete" : ""}</span>
              </span>
            </li>
          )
        });
      }
      return html;
  }

  const alertHtml = (data: ProgressData) => {
    if (!data.complete){
      return (
        <div className="usa-alert usa-alert--warning usa-alert--no-icon">
          <div className="usa-alert__body">
            <h4 className="usa-alert__heading">Your eCR is still processing</h4>
            <p className="usa-alert__text">
              We are processing the file you uploaded 
              ({file && file["name"] ? file["name"] : ''}). Click the 'Cancel' button to 
              process a different file.
            </p>
          </div>
        </div>
      )
    } else {
      return (
        <div className="usa-alert usa-alert--success usa-alert--no-icon">
          <div className="usa-alert__body">
            <h4 className="usa-alert__heading">
              Your eCR has been processed successfully
            </h4>
            <p className="usa-alert__text">
              Click the 'Continue' button to view or download your data or click the 
              'Cancel' button to process a different file.
            </p>
          </div>
        </div>
      )
    }
  }

  const progressHtml = () =>{
    if(!progress || !file){
      return (<></>)
    }
    return (
      <>
        <h1>Processing your eCR</h1>
        <p className="margin-bottom-3 margin-top-3">
          View the progress of your eCR through our pipeline
        </p>
        {alertHtml(progress)}
        <div 
          className="usa-step-indicator usa-step-indicator--counters margin-top-3"
          aria-label="progress"
        >
          <ol className="usa-step-indicator__segments">
            {stepHtml(progress)}
          </ol>
        </div>
        <div className='margin-top-4'>
          <button type="button" className="usa-button--outline usa-button" onClick={()=>location.reload()}>Cancel</button>
          <button
            type="button"
            className="usa-button"
            onClick={()=>location.reload()}
            disabled={progress.complete ? false : true}
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
                    name="file-input-single" onChange={(handleFileChange)}
                />
                <div className="margin-top-205">
                    <LinkAccordion></LinkAccordion>
                </div>
                <Button className="margin-top-3" disabled={!file} type="button" onClick={handleSubmit}>Continue</Button>
            </FormGroup>
        </div>
      )
    }
}
