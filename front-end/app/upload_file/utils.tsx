import { v4 } from 'uuid';

interface serviceFeatures {
  iconClass: string;
  formalName: string;
  display?: boolean;
} 

const servicesConstants: { [key: string]: serviceFeatures } = {
  "validate": {
    iconClass: "exporting-icon",
    formalName: "Validating data fields"
  },
  "convert-to-fhir": {
    iconClass: "fhir-icon",
    formalName: "Converting to FHIR"
  },
  "standardize_names": {
    iconClass: "standardizing-icon",
    formalName: "Standardizing Name",
    display: false
  },
  "standardize_phones": {
    iconClass: "standardizing-icon",
    formalName: "Standardizing Phone",
    display: false
  },
  "standardize_dob": {
    iconClass: "standardizing-icon",
    formalName: "Standardizing and cleaning"
  },
  "parse_message": {
    iconClass: "parse-icon",
    formalName: "Parsing relevant data fields"
  }
}

export interface Step  {
  service: string;
  serviceName: string;
  stub: string;
  endpoint: string;
  complete: boolean;
  progressState: string;
  iconClass: string;
  formalName: string;
  display: boolean;
}

export type ProgressData = {
  steps: Step[],
  complete: boolean
}

const isComplete = (step: Step, data: any) => {
  let stub = step.stub
  return data[stub] && data[stub]["status_code"] == 200 ? true : false;
}

const setProgressState = (complete: boolean, previousStep: string) => {
  if(complete){
      return "complete"
  } else if(previousStep === "complete" && !complete){
    return "in-progress"
  }
  return "incomplete"
}

export const formatData = (str: string) => {
  let data = JSON.parse(str);
  if(data["message"] && data["message"] === "Processing succeeded!"){
    data["complete"] = true;
    return data
  }
  let rawSteps = data['steps']
  if(!rawSteps){
    throw new Error("Progress data is malformed");
  }
  let formatted: ProgressData = {
    steps: [],
    complete: false
  }
  let previousStep = "inc"
  for(let rawStep of rawSteps){
    let stub: string = rawStep["endpoint"].split('/').pop();
    let step = {
      service: rawStep['service'],
      serviceName: rawStep["service"].replace("Fhir", "FHIR"),
      endpoint: rawStep['endpoint'],
      stub: stub,
      complete: false,
      progressState: 'incomplete',
      iconClass: servicesConstants[stub] && servicesConstants[stub].iconClass ? 
        servicesConstants[stub].iconClass : "",
      formalName: servicesConstants[stub] && servicesConstants[stub].formalName ?
        servicesConstants[stub].formalName : "",
      display: servicesConstants[stub] && servicesConstants[stub].display === false ?
        false : true
    }
    step.complete = isComplete(step, data);
    step.progressState = setProgressState(step.complete, previousStep);
    previousStep = step.progressState;
    
    formatted.steps.push(step)
  }
  formatted.complete = !formatted.steps.find((step) => !step.complete)
  return formatted;
}


export const createWebSocket = (url: string) => {
  return new WebSocket(url)
}

export const stepClass = (step: Step)=>{
    let classStr = ""
    classStr = step.progressState  === "complete" ? "usa-step-indicator__segment--complete" : "";
    classStr += step.progressState === "in-progress" ? 
      " usa-step-indicator-in-progress" : "";
    classStr += step.progressState !== 'incomplete' ? 
      ` ${step.iconClass}`: '';
    return classStr;
}

export const stepHtml = (data: ProgressData) => {
    let html: any[] = []
    if(data.steps){
      data.steps.forEach((step: Step )=> {
        if(!step.display){
          return;
        }
        let classStr = stepClass(step)
        let serviceName = step.formalName ? step.formalName : 
          step.service;
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

export const alertHtml = (data: ProgressData, file: File) => {
    if (!data.complete){
      return (
        <div className="usa-alert usa-alert--warning usa-alert--no-icon">
          <div className="usa-alert__body">
            <h4 className="usa-alert__heading text-bold">Your eCR is still processing</h4>
            <p className="usa-alert__text font-sans-xs">
              We are processing the file you uploaded 
              ({file && file["name"] ? file["name"] : ''}). Click the &apos;Cancel&apos; button to 
              process a different file.
            </p>
          </div>
        </div>
      )
    } else {
      return (
        <div className="usa-alert usa-alert--success usa-alert--no-icon">
          <div className="usa-alert__body">
            <h4 className="usa-alert__heading text-bold">
              Your eCR has been processed successfully
            </h4>
            <p className="usa-alert__text font-sans-xs">
              Click the &apos;Continue&apos; button to view or download your data or click the 
              &apos;Cancel&apos; button to process a different file.
            </p>
          </div>
        </div>
      )
    }
  }