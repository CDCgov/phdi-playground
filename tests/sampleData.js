export const sampleDataComplete = "{\"steps\": [{\"service\": \"validation\", \"endpoint\": \"/validate\"}, {\"service\": \"fhir_converter\", \"endpoint\": \"/convert-to-fhir\"}], \"validate\": {\"status_code\": 200, \"Message\": \"OK\"}, \"convert-to-fhir\": {\"status_code\": 200, \"Message\": \"OK\"}}"
export const sampleDataIncomplete = "{\"steps\": [{\"service\": \"validation\", \"endpoint\": \"/validate\"}, {\"service\": \"fhir_converter\", \"endpoint\": \"/convert-to-fhir\"}], \"validate\": {\"status_code\": 200, \"Message\": \"OK\"}}"
export const stepsPartialComplete = [
        {
          service: 'validation',
          serviceName: 'validation',
          endpoint: '/validate',
          stub: 'validate',
          complete: true,
          progressState: 'complete',
          iconClass: 'exporting-icon',
          formalName: 'Validating data fields',
          display: true
        },
        {
          service: 'fhir_converter',
          serviceName: 'fhir_converter',
          endpoint: '/convert-to-fhir',
          stub: 'convert-to-fhir',
          complete: false,
          progressState: 'in-progress',
          iconClass: 'fhir-icon',
          formalName: 'Converting to FHIR',
          display: true
        }
      ]
export const stepsComplete = [
        {
          service: 'validation',
          serviceName: 'validation',
          endpoint: '/validate',
          stub: 'validate',
          complete: true,
          progressState: 'complete',
          iconClass: 'exporting-icon',
          formalName: 'Validating data fields',
          display: true
        },
        {
          service: 'fhir_converter',
          serviceName: 'fhir_converter',
          endpoint: '/convert-to-fhir',
          stub: 'convert-to-fhir',
          complete: true,
          progressState: 'complete',
          iconClass: 'fhir-icon',
          formalName: 'Converting to FHIR',
          display: true
        }
      ]