export const sampleDataComplete = JSON.stringify({
  steps: [
    {
      service: "validation",
      endpoint: "/validate"
    },
    {
      service: "fhir_converter",
      endpoint: "/convert-to-fhir"
    }],
  validate: {
    status: "success",
    status_code: 200,
    response: {
      message_valid: true,
      validation_results: {
        fatal: [],
        errors: [],
        warnings: [],
        information: [],
        message_ids: {}
      }
    }
  },
  "convert-to-fhir": {
    status: "success",
    status_code: 200,
    response: "bundle"
  }
})
export const sampleDataIncomplete = JSON.stringify({
  steps: [
    {
      service: "validation",
      endpoint: "/validate"
    },
    {
      service: "fhir_converter",
      endpoint: "/convert-to-fhir"
    }
  ],
  validate: {
    status: "success",
    status_code: 200,
    response: {
      message_valid: true,
      validation_results: {
        fatal: [],
        errors: [],
        warnings: [],
        information: [],
        message_ids: {}
      }
    }
  }
})
export const sampleValidationError = JSON.stringify({
  steps: [
    {
      service: "validation",
      endpoint: "/validate"
    },
    {
      service: "fhir_converter",
      endpoint: "/convert-to-fhir"
    }
  ],
  validate: {
    status: "error",
    status_code: 200,
    response: {
      message_valid: false,
      validation_results: {
        fatal: [
          "Could not find field. Field name: 'Status' Attributes: attribute #1: 'code' with the required value pattern: 'RRVS19|RRVS20|RRVS21|RRVS22', attribute #2: 'codeSystem', attribute #3: 'displayName'",
          "Could not find field. Field name: 'Conditions' Attributes: attribute #1: 'code' with the required value pattern: '[0-9]+', attribute #2: 'codeSystem'"
        ],
        errors: [
          "Could not find field. Field name: 'Middle Name' Attributes: attribute #1: 'qualifier' with the required value pattern: 'IN' Related elements: Field name: 'name' Attributes: attribute #1: 'use' with the required value pattern: 'L'",
          "Could not find field. Field name: 'Provider ID' Attributes: attribute #1: 'extension', attribute #2: 'root'"
        ],
        warnings: [],
        information: [],
        message_ids: {
          eicr: {
            root: "8675309a-7754-r2d2-c3p0-973d9f777777",
            extension: null
          },
          rr: {}
        }
      }
    }
  }
})

export const sampleValidationErrorOneMissingField = JSON.stringify({
  steps: [
    {
      service: "validation",
      endpoint: "/validate"
    },
    {
      service: "fhir_converter",
      endpoint: "/convert-to-fhir"
    }
  ],
  validate: {
    status: "error",
    status_code: 200,
    response: {
      message_valid: false,
      validation_results: {
        fatal: [
          "Could not find field. Field name: 'Status' Attributes: attribute #1: 'code' with the required value pattern: 'RRVS19|RRVS20|RRVS21|RRVS22', attribute #2: 'codeSystem', attribute #3: 'displayName'",
        ],
        errors: [
          "Could not find field. Field name: 'Middle Name' Attributes: attribute #1: 'qualifier' with the required value pattern: 'IN' Related elements: Field name: 'name' Attributes: attribute #1: 'use' with the required value pattern: 'L'",
        ],
        warnings: [],
        information: [],
        message_ids: {
          eicr: {
            root: "8675309a-7754-r2d2-c3p0-973d9f777777",
            extension: null
          },
          rr: {}
        }
      }
    }
  }
})

export const sampleValidationErrorInvalidXML = JSON.stringify({
  steps: [
    {
      service: "validation",
      endpoint: "/validate"
    },
    {
      service: "fhir_converter",
      endpoint: "/convert-to-fhir"
    }
  ],
  validate: {
    status: "error",
    status_code: 200,
    response: {
      message_valid: false,
      validation_results: {
        fatal: [
          "eCR Message is not valid XML!"
        ],
        errors: [],
        warnings: [],
        information: [],
        message_ids: {}
      }
    }
  }
})

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
    display: true,
    error: false,
    response: {
      message_valid: true,
      validation_results: {
        fatal: [],
        errors: [],
        warnings: [],
        information: [],
        message_ids: {}
      }
    }
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
    display: true,
    error: false,
    response: undefined,
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
    display: true,
    error: false,
    response: {
      message_valid: true,
      validation_results: {
        fatal: [],
        errors: [],
        warnings: [],
        information: [],
        message_ids: {}
      }
    }
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
    display: true,
    error: false,
    response: "bundle",
  }
]
export const stepsError = [
  {
    service: 'validation',
    serviceName: 'validation',
    endpoint: '/validate',
    stub: 'validate',
    complete: true,
    progressState: 'error',
    iconClass: 'exporting-icon',
    formalName: 'Validating data fields',
    display: true,
    error: true,
    response: {
      message_valid: false,
      validation_results: {
        fatal: [
          "Could not find field. Field name: 'Status' Attributes: attribute #1: 'code' with the required value pattern: 'RRVS19|RRVS20|RRVS21|RRVS22', attribute #2: 'codeSystem', attribute #3: 'displayName'",
          "Could not find field. Field name: 'Conditions' Attributes: attribute #1: 'code' with the required value pattern: '[0-9]+', attribute #2: 'codeSystem'"
        ],
        errors: [
          "Could not find field. Field name: 'Middle Name' Attributes: attribute #1: 'qualifier' with the required value pattern: 'IN' Related elements: Field name: 'name' Attributes: attribute #1: 'use' with the required value pattern: 'L'",
          "Could not find field. Field name: 'Provider ID' Attributes: attribute #1: 'extension', attribute #2: 'root'"
        ],
        warnings: [],
        information: [],
        message_ids: {
          eicr: {
            root: "8675309a-7754-r2d2-c3p0-973d9f777777",
            extension: null
          },
          rr: {}
        }
      }
    }
  },
  {
    "complete": false,
    "display": true,
    "endpoint": "/convert-to-fhir",
    "error": false,
    "formalName": "Converting to FHIR",
    "iconClass": "fhir-icon",
    "progressState": "incomplete",
    "service": "fhir_converter",
    "serviceName": "fhir_converter",
    "stub": "convert-to-fhir"
  }
]