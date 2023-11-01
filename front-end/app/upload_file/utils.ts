import * as changeCase from "change-case";

interface serviceFeatures {
  iconClass: string;
  formalName: string;
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
    formalName: "Standardizing Name"
  },
  "standardize_phones": {
    iconClass: "standardizing-icon",
    formalName: "Standardizing Phone"
  },
  "standardize_dob": {
    iconClass: "standardizing-icon",
    formalName: "Standardizing DOB"
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
}

export type ProgressData = {
  steps: Step[],
  complete: boolean
}

const isComplete = (step: Step, data: any) => {
    let stub = step.stub
    return data[stub] && data[stub]["status_code"] == 200 
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
      serviceName: changeCase.sentenceCase(rawStep["service"])
            .replace("Fhir", "FHIR"),
      endpoint: rawStep['endpoint'],
      stub: stub,
      complete: false,
      progressState: 'incomplete',
      iconClass: servicesConstants[stub] && servicesConstants[stub].iconClass ? 
        servicesConstants[stub].iconClass : "",
      formalName: servicesConstants[stub] && servicesConstants[stub].formalName ?
        servicesConstants[stub].formalName : ""
    }
    step.complete = isComplete(step, data);
    step.progressState = setProgressState(step.complete, previousStep);
    previousStep = step.progressState;
    
    formatted.steps.push(step)
  }
  formatted.complete = !formatted.steps.find((step) => !step.complete)
  return formatted;
}

