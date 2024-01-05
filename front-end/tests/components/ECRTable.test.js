import React from 'react';
import {render, screen} from '@testing-library/react';
import "@testing-library/jest-dom";
import ECRTable from '../../components/ECRTable/ECRTable'; // Adjust the import path as per your project structure
import fullEcrData from "./ecrData.json"

describe('ECRTable', () => {
    it('renders ECRTable component with provided data', async () => {
       console.log(fullEcrData)

        const ecrData = {
            "processed_values": {
                "message": "Parsing succeeded!",
                "parsed_values": {
                    "patient_id": "123",
                    "person_id": null,
                    "last_name": "BEAKER",
                    "first_name": "CATEST",
                    "birth_date": "2016-01-27",
                    "gender": "female"
                }
            }
        };

        render(<ECRTable ecrData={ecrData}/>);

        // You can add more specific assertions here
        // For example, checking if the table headers and data are rendered
        expect(screen.getByText('Field Name')).toBeInTheDocument();
        expect(screen.getByText('Field Value')).toBeInTheDocument();
        expect(screen.getByText('Patient Id')).toBeInTheDocument();
        expect(screen.getByText('123')).toBeInTheDocument();
        // Add similar assertions for other data fields
    });

    it('renders ECRTable component with ALL provided data', async () => {
        expect(render(<ECRTable ecrData={fullEcrData}/>)).toMatchSnapshot();
    });
});
