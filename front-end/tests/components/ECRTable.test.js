import React from 'react';
import { render, screen } from '@testing-library/react';
import "@testing-library/jest-dom";
import ECRTable from '../../components/ECRTable'; // Adjust the import path as per your project structure

describe('ECRTable', () => {
    it('renders ECRTable component with provided data', () => {
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

        render(<ECRTable ecrData={ecrData} />);

        // You can add more specific assertions here
        // For example, checking if the table headers and data are rendered
        expect(screen.getByText('eCR Viewer')).toBeInTheDocument();
        expect(screen.getByText('Field Name')).toBeInTheDocument();
        expect(screen.getByText('Field Value')).toBeInTheDocument();
        expect(screen.getByText('Patient Id')).toBeInTheDocument();
        expect(screen.getByText('123')).toBeInTheDocument();
        // Add similar assertions for other data fields
    });
});
