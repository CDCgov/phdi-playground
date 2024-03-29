import { v4 } from 'uuid';

interface serviceFeatures {
  iconClass: string;
  formalName: string;
  display: boolean;
} 

const servicesConstants: { [key: string]: serviceFeatures } = {
  "validate": {
    iconClass: "exporting-icon",
    formalName: "Validating data fields",
    display: true,
  },
  "convert-to-fhir": {
    iconClass: "fhir-icon",
    formalName: "Converting to FHIR",
    display: true,
  },
  "standardize_names": {
    iconClass: "standardizing-icon",
    formalName: "Standardizing Name",
    display: false,
  },
  "standardize_phones": {
    iconClass: "standardizing-icon",
    formalName: "Standardizing Phone",
    display: false,
  },
  "standardize_dob": {
    iconClass: "standardizing-icon",
    formalName: "Standardizing and cleaning",
    display: true,
  },
  "parse_message": {
    iconClass: "parse-icon",
    formalName: "Parsing relevant data fields",
    display: true,
  }
}

export interface Step  {
  service: string;
  serviceName: string;
  stub: string;
  endpoint: string;
  complete: boolean;
  error: boolean;
  progressState: string;
  iconClass: string;
  formalName: string;
  display: boolean;
  response: any;
}

export type ProgressData = {
  steps: Step[],
  complete: boolean
  error: boolean
}

const isComplete = (stub: string, data: any) => {
  return !!(data[stub] && data[stub]["status_code"] === 200);
}

const isError = (stub: string, data: any) => {
  return !!(data[stub] && data[stub]["status"] === "error");
}

const setProgressState = (step: Step, previousStep: string) => {
  if(step.complete && !step.error){
      return "complete"
  }
  else if(step.error){
    return "error"
  }
  else if(previousStep === "complete" && !step.complete){
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

  if(data["message"] && data["message"] === "Something went wrong"){
    data["error"] = true;
    return data
  }

  let rawSteps = data['steps']
  if(!rawSteps){
    throw new Error("Progress data is malformed");
  }
  let formatted: ProgressData = {
    steps: [],
    complete: false,
    error: false,
  }
  let previousStep = "inc"
  for(let rawStep of rawSteps){
    let stub: string = rawStep["endpoint"].split('/').pop();
    let step = {
      service: rawStep['service'],
      serviceName: rawStep["service"].replace("Fhir", "FHIR"),
      endpoint: rawStep['endpoint'],
      stub: stub,
      complete: isComplete(stub, data),
      error: isError(stub, data),
      progressState: 'error',
      iconClass: servicesConstants[stub] && servicesConstants[stub].iconClass ? 
        servicesConstants[stub].iconClass : "",
      formalName: servicesConstants[stub] && servicesConstants[stub].formalName ?
        servicesConstants[stub].formalName : "",
      display: servicesConstants[stub] && servicesConstants[stub].display,
      response: data[stub] ? data[stub]["response"] : undefined,
    }
    step.progressState = setProgressState(step, previousStep);
    previousStep = step.progressState;
    
    formatted.steps.push(step)
  }
  formatted.complete = !formatted.steps.find((step) => !step.complete)
  formatted.error = !!formatted.steps.find((step) => step.error)
  return formatted;
}


export const createWebSocket = (url: string) => {
  return new WebSocket(url)
}

export const stepClass = (step: Step)=>{
    switch (step.progressState){
      case 'error':
        return "usa-step-indicator__segment--complete error-icon";
      case 'complete':
        return `usa-step-indicator__segment--complete ${step.iconClass}`;
      case 'in-progress':
        return `usa-step-indicator-in-progress ${step.iconClass}`
      default:
        return "";
    }
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
  const missingFieldError = (error: string) => error.match(/(^Could not find field.*)/);

  const formatError = (error: string) => {
    if (missingFieldError(error)){
      return error.replace("Could not find field.", "")
    }
    return error;
  };

  if(data.error){
    const validateStep = data?.steps?.findLast(step => step.endpoint === "/validate")

    if (validateStep?.error) {
      const fatalErrors = validateStep.response["validation_results"] && validateStep.response["validation_results"]["fatal"] || []
      if (fatalErrors.length > 1 || (fatalErrors.length == 1 && missingFieldError(fatalErrors[0]))) {
        return (
          <div className="usa-alert usa-alert--error usa-alert--no-icon maxw-tablet">
            <div className="usa-alert__body padding-0">
              <p className="usa-alert__text font-sans-xs text-bold">
                We couldn’t validate your eCR
              </p>
              We noticed the following required fields were missing:
              <ul>
                {fatalErrors.map((error: string) => <li key={v4()}>{formatError(error)}</li>)}
              </ul>
              Please upload an eCR that contains these fields.
            </div>
          </div>
        )
      } else {
        return (
          <div className="usa-alert usa-alert--error usa-alert--no-icon maxw-tablet">
            <div className="usa-alert__body padding-0">
              <p className="usa-alert__text font-sans-xs text-bold">
                We couldn’t validate your eCR
              </p>
              Something went wrong and we were unable to validate your eCR file. Please try re-uploading the file. If
              this error persists, try uploading a different eCR file.
            </div>
          </div>
        )
      }
    }

    return (
      <div className="usa-alert usa-alert--error usa-alert--no-icon maxw-tablet">
        <div className="usa-alert__body padding-0">
          <p className="usa-alert__text font-sans-xs text-bold">
            We could not upload your file at this time, please try again
          </p>
        </div>
      </div>
    )
  } else if (!data.complete) {
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