'use client'
import React, { useState, useEffect } from 'react';
import { useData } from '@/utils/DataContext';
import _ from 'lodash';
import { Checkbox, Button } from '@trussworks/react-uswds'; // https://designsystem.digital.gov/components/checkbox/
import './page.scss' 
import { json } from 'stream/consumers';

// read in message-parser bundle and parse
// const ecrData = useData(); // Access the shared data;
const ecrData = {"message":"Processing succeeded!","processed_values":{"message":"Parsing succeeded!","parsed_values":{"patient_id":"9483a462-949c-4759-a18b-35da40c31f2f","last_name":"ZZTESTTWELVE","first_name":"CEDARSECR","birth_date":"1990-12-31","gender":"female","race":"Black or African American","ethnicity":"Hispanic or Latino","street_address1":"1123 MALTMAN STREET","state":"CA","zip":"90026","rr_id":"81109d01-969d-42a2-9cc2-5c20d05eb184","status":"RRVS19","conditions":"Disease caused by severe acute respiratory syndrome coronavirus 2 (disorder)","eicr_set_id":"e1634a9e-128f-11ed-b2a6-005056a7fb21","eicr_id":"1.2.840.114350.1.13.202.3.7.8.688883.314","eicr_version_number":"4","replaced_eicr_id":"Composition/1.2.840.114350.1.13.202.3.7.8.688883.313","replaced_eicr_version":"3","authoring_datetime":"2022-08-02T15:25:00-07:00","provider_id":"11003564","facility_id_number":"1.2.840.114350.1.13.202.3.7.2.686980","facility_name":"CSMG Internal Medicine","facility_type":"Healthcare Facility","encounter_type":"Ambulatory","encounter_start_date":"2022-08-02T11:00:00-07:00","encounter_end_date":"2022-08-02T11:20:00-07:00","active_problems":[{"problem":"Mild to moderate pre-eclampsia","problem_date":"2022-07-21"},{"problem":"Depression, recurrent","problem_date":"2022-07-21"},{"problem":"Pain, upper back","problem_date":"2022-07-22"},{"problem":"2019 novel coronavirus disease (COVID-19)","problem_date":"2022-08-02"},{"problem":"Generalized abdominal pain","problem_date":"2022-08-02"},{"problem":"Eclampsia, antepartum","problem_date":"2022-08-02"},{"problem":"Pregnancy related exhaustion and fatigue, antepartum","problem_date":"2022-08-02"},{"problem":"Pregnancy test positive","problem_date":"2022-08-02"}],"labs":[],"preferred_language":"English"}},"complete":true};
const tableData = ecrData?.processed_values?.parsed_values

export default function CheckboxesPage() {
  const renderCheckboxes = () => {
    // remove null fields and standardize naming
    Object.keys(tableData || {}).forEach((k) => tableData[k] == null && delete tableData[k]);
    const options = Object.keys(tableData || {});
    const formatHeader = (innerOption: string) => _.startCase(innerOption)
      .replace(/rr /i, "RR ")
      .replace(/eicr /i, "eICR ")
      .replace(/ecr /i, "eCR ");

    // TODO: remove array fields from options, present as separate sections like ECRTable.tsx
    const arrayOptions = options.filter((option) => Array.isArray(tableData[option]));
    arrayOptions.forEach(arrayOption => { options.splice(options.indexOf(arrayOption), 1) });

    // Initialize checkedItems with all options checked by default
    const initialCheckedItems = options.reduce((acc, option) => {
      acc[option] = true;
      return acc;
    }, {});
    const [checkedItems, setCheckedItems] = useState(initialCheckedItems);

    // add deselect button
    const handleCheckboxChange = (event) => {
      const { name, checked } = event.target;
      setCheckedItems((prevCheckedItems) => ({ ...prevCheckedItems, [name]: checked }));
    };
    const deselectAll = () => {
      const uncheckedItems = options.reduce((acc, option) => {
        acc[option] = false;
        return acc;
      }, {});
      setCheckedItems(uncheckedItems);
    };

    // add checkboxes
    const checkboxes = options.map((option) => (
      <Checkbox
        key={option}
        id={`checkbox-${option}`}
        name={option}
        label={formatHeader(option)}
        checked={checkedItems[option] || false}
        onChange={handleCheckboxChange}
      />
    ));
    
    // get each item in the array as checkboxes
    const initialCheckedItemsArray = arrayOptions.reduce((acc, option) => {
      acc[option] = true;
      return acc;
    }, {});
    const [checkedItemsArray, setCheckedItemsArray] = useState(initialCheckedItemsArray);    
    const handleCheckboxChangeArray = (event) => {
      const { name, checked } = event.target;
      setCheckedItemsArray((prevCheckedItems) => ({ ...prevCheckedItems, [name]: checked }));
    };
    const getArrayCheckboxes = arrayOptions.map((option) => (
        <Checkbox
          key={option}
          id={`checkbox-${option}`}
          name={option}
          label={formatHeader(option)}
          checked={checkedItemsArray[option] || false}
          onChange={handleCheckboxChangeArray}
        />
      ));
    console.log(getArrayCheckboxes)

    const deselectAllArray = () => {
      const uncheckedItemsArray = arrayOptions.reduce((acc, option) => {
        acc[option] = false;
        return acc;
      }, {});
      setCheckedItemsArray(uncheckedItemsArray);
    };    
    return { checkboxes, checkedItems, getArrayCheckboxes };
  };

  // code taken from export page to establish button
  const downloadFile = () => {
    // Convert the data object to a JSON string
    const jsonData = JSON.stringify(tableData);

    // TODO Filter out unchecked items
    // const { checkedItems } = renderCheckboxes();
    const filteredData = tableData;
    const selectedData = JSON.stringify(filteredData);

    // Create a Blob with the JSON data
    const blob = new Blob([selectedData], { type: 'application/json' });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';

    // Programmatically click the anchor element to trigger the download
    a.click();

    // Clean up by revoking the URL
    URL.revokeObjectURL(url);
  };

  const { checkboxes, deselectAll, getArrayCheckboxes, deselectAllArray } = renderCheckboxes();

  return (
    <div>
      <h1>Customize your bundle</h1>
      <h3>Select which fields wish to <i><b>omit</b></i> from the options below:</h3>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' , background: '#f0f0f080'}}>
        <div style={{ marginLeft: 'auto' }}>
          <a href="#" onClick={deselectAll} style={{ color: '#0000FF', textDecoration: 'underline' }}>Deselect All</a>
        </div>
      </div>
      <div className="checkbox-container">
        {checkboxes}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' , background: '#f0f0f080'}}>
        <div style={{ marginLeft: 'auto' }}>
          <a href="#" onClick={deselectAllArray} style={{ color: '#0000FF', textDecoration: 'underline' }}>Deselect All</a>
        </div>
      </div>      
      <div className="checkbox-container">
        {getArrayCheckboxes}
      </div>      
      <br />
      <Button type="button" onClick={downloadFile}>Download (.json)</Button>
    </div>

  );
};


// scratch
      // TODO Filter out unchecked items
      // const checkedItems = renderCheckboxes().checkedItems;
      // const filteredData = Object.keys(checkedItems).reduce((acc, key) => {
      //   const isChecked = checkedItems[key];    
      //   if (isChecked) {
      //     // If the field is an array, filter the array based on checkedItems
      //     if (Array.isArray(tableData[key])) {
      //       acc[key] = tableData[key].filter((item, index) => checkedItems[`${key}_${index}`])
      //     } else {
      //       // Otherwise, include the entire field
      //       acc[key] = tableData[key];
      //     }
      //   }
    
      //   return acc;
      // }, {});
