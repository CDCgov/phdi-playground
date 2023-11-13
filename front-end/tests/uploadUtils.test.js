import * as utils from "../app/upload_file/utils"
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import {sampleDataComplete, sampleDataIncomplete, stepsPartialComplete, stepsComplete }  from './sampleData'

describe("format data", ()=>{
  it("formats a complete response package", ()=>{
    
    let formattedData = {
      steps: stepsComplete,
      complete: true
    }
    
    expect(utils.formatData(sampleDataComplete)).toEqual(formattedData)
  })
  it("formats an incomplete response package", ()=>{
    
    let formattedData = {
      steps: stepsPartialComplete,
      complete: false
    }
    
    expect(utils.formatData(sampleDataIncomplete)).toEqual(formattedData)
  })
})

describe("stepClass", ()=>{
  it("returns a complete class when step is complete", ()=>{
    expect(utils.stepClass(stepsPartialComplete[0])).toEqual("usa-step-indicator__segment--complete exporting-icon")
  })

  it("returns an incomplete class when step is incomplete", ()=>{
    expect(utils.stepClass(stepsPartialComplete[1])).toEqual(" usa-step-indicator-in-progress fhir-icon")
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
})
