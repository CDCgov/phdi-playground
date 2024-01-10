'use client'
import React, { useState, useEffect } from 'react';
import { useData } from '@/utils/DataContext';
import _ from 'lodash';
import { Checkbox, Button } from '@trussworks/react-uswds'; // https://designsystem.digital.gov/components/checkbox/
import './page.scss' 
import { json } from 'stream/consumers';
import ecrData from './data.json'; // test data; remove once complete

// read in message-parser bundle and parse
// const ecrData = useData(); // Access the shared data;
const tableData = ecrData?.processed_values?.parsed_values

export default function CheckboxesPage() {
  const [keysDict, setKeysDict] = useState({});
  const [checkedItems, setCheckedItems] = useState({});

  // Handle checkbox change
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCheckedItems((prev) => ({ ...prev, [name]: checked }));
  };

  useEffect(() => {
    const extractKeys = () => {
      const keysDictTemp = {};

      // Directly access and process 'parsed_values'
      if (tableData) {
        keysDictTemp['parsed_values'] = Object.keys(tableData || {}).filter((key) => !Array.isArray(tableData[key]));
      }
      // Directly access and process 'labs'
      if (tableData.labs && Array.isArray(tableData.labs) && tableData.labs.length > 0) {
        const labKeys = new Set();
        tableData.labs.forEach((item) => {
          Object.keys(item).forEach((key) => labKeys.add(key));
        });
        keysDictTemp['labs'] = Array.from(labKeys);
      }

      // Directly access and process 'active_problems'
      if (
        tableData.active_problems &&
        Array.isArray(tableData.active_problems) &&
        tableData.active_problems.length > 0
      ) {
        const problemKeys = new Set();
        tableData.active_problems.forEach((item) => {
          Object.keys(item).forEach((key) => problemKeys.add(key));
        });
        keysDictTemp['active_problems'] = Array.from(problemKeys);
      }

      return keysDictTemp;
    };

    const keys = extractKeys();
    setKeysDict(keys);
  }, []);

  // Initialize all checkboxes as checked
  useEffect(() => {
    const initialChecked = Object.values(keysDict).flat().reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setCheckedItems(initialChecked);
  }, [keysDict]);

  const deselectAll = (section) => {
    const uncheckedItems = keysDict[section].reduce((acc, option) => {
      acc[option] = false;
      return acc;
    }, {});
    setCheckedItems((prev) => ({ ...prev, ...uncheckedItems }));
  };


  // Create checkbox components
  const createCheckboxes = () => {
    return Object.keys(keysDict).map((section) => (
      <div key={section}>
        <div className="deselect-all-container">
          <th>{_.startCase(section)}</th>
          <button className="deselect-all-button" onClick={() => deselectAll(section)}>
            Deselect All
          </button>
        </div>
        <div className="checkbox-container">
          {keysDict[section].map((key) => (
            <div key={key}>
              <Checkbox
                id={`checkbox-${key}`}
                name={key}
                label={_.startCase(key).replace(/rr /i, "RR ")
                .replace(/eicr /i, "eICR ")
                .replace(/ecr /i, "eCR ")}
                checked={checkedItems[key]}
                onChange={handleCheckboxChange}
              />
            </div>
          ))}
        </div>
        <br />
      </div>
    ));
  };

  const checkboxes = createCheckboxes();

  // code taken from export page to establish button
  const downloadFile = () => {
    // Filter out unchecked items -- TODO, make lab and active problems dynamic to account for future arrays
    const filteredData = tableData;
    for (const key in checkedItems) {
      if (!checkedItems[key]) {
        delete filteredData[key];
    
        if (filteredData.labs && Array.isArray(filteredData.labs)) {
          filteredData.labs.forEach((lab) => {
            if (lab.hasOwnProperty(key)) {
              delete lab[key];
            }
          });
        }
    
        if (filteredData.active_problems && Array.isArray(filteredData.active_problems)) {
          filteredData.active_problems.forEach((problem) => {
            if (problem.hasOwnProperty(key)) {
              delete problem[key];
            }
          });
        }
      }
    }
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

  return (
    <div>
      <h1>Customize your bundle</h1>
      <h3>Select which fields you wish to <i><b>omit</b></i> from the options below:</h3>
        {checkboxes}
      <Button type="button" onClick={downloadFile}>Download (.json)</Button>
      <Button type="button" className="usa-button--outline usa-button" onClick={() => location.reload()}>Cancel</Button>
    </div>
  );
}