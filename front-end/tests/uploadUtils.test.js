import * as utils from "../app/upload_file/utils"
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import {
  sampleDataComplete,
  sampleDataIncomplete,
  stepsPartialComplete,
  stepsComplete,
  sampleValidationError,
  stepsError, sampleValidationErrorInvalidXML, sampleValidationErrorOneMissingField,
} from './sampleData'

describe("format data", ()=>{
  it("formats a complete response package", ()=>{
    
    let expectedFormattedData = {
      steps: stepsComplete,
      complete: true,
      error: false
    }
    
    expect(utils.formatData(sampleDataComplete)).toEqual(expectedFormattedData)
  })
  it("formats an incomplete response package", ()=>{
    
    let formattedData = {
      steps: stepsPartialComplete,
      complete: false,
      error: false
    }
    
    expect(utils.formatData(sampleDataIncomplete)).toEqual(formattedData)
  })
  it("formats an error response package", ()=>{

    let formattedData = {
      steps: stepsError,
      complete: false,
      error: true
    }

    expect(utils.formatData(sampleValidationError)).toEqual(formattedData)
  })
})

describe("stepClass", ()=>{
  it("returns a complete class when step is complete", ()=>{
    expect(utils.stepClass(stepsPartialComplete[0])).toEqual("usa-step-indicator__segment--complete exporting-icon")
  })

  it("returns an incomplete class when step is incomplete", ()=>{
    expect(utils.stepClass(stepsPartialComplete[1])).toEqual("usa-step-indicator-in-progress fhir-icon")
  })

  it("returns an error class when step is error", ()=>{
    expect(utils.stepClass(stepsError[0])).toEqual("usa-step-indicator__segment--complete error-icon")
  })
})

describe("stepHtml", ()=>{
  it("returns one html block per step", ()=>{
    const result = utils.stepHtml(utils.formatData(sampleDataIncomplete))
    expect(result.length).toEqual(2)
  })
})

describe("alertHtml", ()=>{
  it("returns an incomplete block when data is incomplete",()=>{
    const {container} = render(
        utils.alertHtml(
          utils.formatData(sampleDataIncomplete), 
          new File(['{"test": "content"}'], 'foo.json', { type: 'text/json' })
        )
    );

    expect(container.querySelector('p')).toHaveTextContent('foo.json');
    expect(container.querySelector('h4')).toHaveTextContent('Your eCR is still processing');
  })

  it("returns a complete block when data is complete",()=>{
    const {container} = render(
        utils.alertHtml(
          utils.formatData(sampleDataComplete), 
          new File(['{"test": "content"}'], 'bar.json', { type: 'text/json' })
        )
    );

    expect(container.querySelector('p')).toHaveTextContent("Click the 'Continue' button");
    expect(container.querySelector('h4')).toHaveTextContent('Your eCR has been processed successfully');
  })

  it("returns a generic validation error block when data is not valid xml",()=>{
    const {container} = render(
      utils.alertHtml(
        utils.formatData(sampleValidationErrorInvalidXML),
        new File(['{"test": "content"}'], 'bar.json', { type: 'text/json' })
      )
    );

    expect(container).toHaveTextContent("We couldn’t validate your eCR");
    expect(container).toHaveTextContent("Something went wrong and we were unable to validate your eCR file. Please try re-uploading the file. If this error persists, try uploading a different eCR file.");
  })

  it("returns a list the missing fields when validation service fails",()=>{
    const {container} = render(
      utils.alertHtml(
        utils.formatData(sampleValidationError),
        new File(['{"test": "content"}'], 'bar.json', { type: 'text/json' })
      )
    );

    expect(container).toHaveTextContent("We couldn’t validate your eCR");
    expect(container).toHaveTextContent("We noticed the following required fields were missing:");
    expect(container).toHaveTextContent("Field name: 'Status' Attributes: attribute #1: 'code' with the required value pattern: 'RRVS19|RRVS20|RRVS21|RRVS22', attribute #2: 'codeSystem', attribute #3: 'displayName'");
    expect(container).toHaveTextContent("Field name: 'Conditions' Attributes: attribute #1: 'code' with the required value pattern: '[0-9]+', attribute #2: 'codeSystem'");
  })

  it("returns a the missing field when validation service fails",()=>{
    const {container} = render(
      utils.alertHtml(
        utils.formatData(sampleValidationErrorOneMissingField),
        new File(['{"test": "content"}'], 'bar.json', { type: 'text/json' })
      )
    );

    expect(container).toHaveTextContent("We couldn’t validate your eCR");
    expect(container).toHaveTextContent("We noticed the following required fields were missing:");
    expect(container).toHaveTextContent("Field name: 'Status' Attributes: attribute #1: 'code' with the required value pattern: 'RRVS19|RRVS20|RRVS21|RRVS22', attribute #2: 'codeSystem', attribute #3: 'displayName'");
  })

})
