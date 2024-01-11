'use client'
import React, { useState, useEffect } from 'react';
import { useData } from '@/utils/DataContext';
import _ from 'lodash';
import { Checkbox, Button } from '@trussworks/react-uswds'; // https://designsystem.digital.gov/components/checkbox/
import './page.scss' 
import { json } from 'stream/consumers';
import ecrData from './data.json'; // test data; remove once complete
import { useRouter } from 'next/navigation';


// read in message-parser bundle and parse
// const ecrData = useData(); // Access the shared data;
const tableData = ecrData?.processed_values?.parsed_values

export default function CheckboxesPage() {
  const router = useRouter();
  const [keysDict, setKeysDict] = useState({});
  const [checkedItems, setCheckedItems] = useState({});
  const [sectionSelection, setSectionSelection] = useState({});

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
        keysDictTemp['patient_information'] = Object.keys(tableData || {}).filter((key) => !Array.isArray(tableData[key]));
      }
      // Directly access and process 'labs' and 'active_problems'
      Object.keys(tableData || {}).forEach((key) => {
        if (Array.isArray(tableData[key]) && tableData[key].length > 0) {
          const newKeys = new Set();
          tableData[key].forEach((item) => {
            Object.keys(item).forEach((itemKey) => newKeys.add(itemKey));
          });
          keysDictTemp[key] = Array.from(newKeys);
        }
      });
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

  // Toggle select all/deselect all
  const handleToggleSelectAll = (section) => {
    const updatedCheckedItems = { ...checkedItems };
    const updatedSectionSelection = { ...sectionSelection };
  
    if (!updatedSectionSelection[section]) {
      // Deselect all checkboxes in the section
      keysDict[section].forEach((key) => {
        updatedCheckedItems[key] = false;
      });
      updatedSectionSelection[section] = true;
    } else {
      // Select all checkboxes in the section
      keysDict[section].forEach((key) => {
        updatedCheckedItems[key] = true;
      });
      updatedSectionSelection[section] = false;
    }
  
    setCheckedItems(updatedCheckedItems);
    setSectionSelection(updatedSectionSelection);
  };
  
  

  // Create checkbox components
  const createCheckboxes = () => {
    return Object.keys(keysDict).map((section) => (
      <div key={section}>
        <div>
          <h2>{_.startCase(section)}</h2> {/*TODO: once transitioned to ecr_with_metadata, this would be replaced with the category*/}
        </div>
        <div className="deselect-all-container">
          <th>{_.startCase(section)}</th> {/*TODO: once transitioned to ecr_with_metadata, this would be replaced with the subcategory*/}
          <button className="deselect-all-button" onClick={() => handleToggleSelectAll(section)}>
          {sectionSelection[section] ? 'Select All' : 'Deselect All'}
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
    // Filter out unchecked items
    const filteredData = { ...tableData };
    for (const key in checkedItems) {
      if (!checkedItems[key]) {
        delete filteredData[key];
  
        for (const arrayName in filteredData) {
          if (Array.isArray(filteredData[arrayName])) {
            filteredData[arrayName].forEach((item) => {
              if (item.hasOwnProperty(key)) {
                delete item[key];
              }
            });
            // Remove the array if it becomes empty or contains only empty objects
            if (
              filteredData[arrayName].length === 0 ||
              filteredData[arrayName].every((item) => Object.keys(item).length === 0)
            ) {
              delete filteredData[arrayName];
            }
          }
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
      <Button type="button" className="usa-button--outline usa-button" onClick={() => window.history.back()}>Cancel</Button>
    </div>
  );
}