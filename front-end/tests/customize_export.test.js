import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import "@testing-library/jest-dom";
import CustomizeExportPage from '../app/customize_export/page'; // Adjust the import path as needed

// Mock the DataContext module
jest.mock('../utils/DataContext', () => ({
    useData: () => ({
        data: {
            "processed_values": {
                "message": "Parsing succeeded!",
                "parsed_values": {
                    "patient_id": "95a52bd2-2a17-4888-af52-be3472c94e0e",
                    "person_id": null,
                    "last_name": "BEAKER",
                    "first_name": "CATEST",
                    "birth_date": "2016-01-27",
                    "gender": "female"
                }
            }
        },
    }),
}));

global.URL.createObjectURL = jest.fn();
global.URL.revokeObjectURL = jest.fn();

describe("Customize Export Page", () => {
    it("Customize Export Page component should render page", () => {
      render(<CustomizeExportPage />);
      expect(screen.getByText('Customize your bundle')).toBeInTheDocument();
    });
  
    it('should toggle checkbox when clicked', () => {
      render(<CustomizeExportPage />);
      
      // Find the "Deselect All" button and click it
      const deselectButton = screen.getByText('Deselect All');
      fireEvent.click(deselectButton);
  
      // Get all the checkboxes within the "checkbox-container" div
      const checkboxes = screen.getAllByTestId('checkbox');
  
      // Assert that all checkboxes are unchecked
      checkboxes.forEach((checkbox) => {
        expect(checkbox.querySelector('input')).not.toBeChecked();
      });
  
      // Click the "Select All" button to check boxes again
      const selectButton = screen.getByText('Select All');
      fireEvent.click(selectButton);
  
      // Assert that all checkboxes are checked again
      checkboxes.forEach((checkbox) => {
        expect(checkbox.querySelector('input')).toBeChecked();
      });
    });
  });
  

test('ExportPage component should render and trigger download', () => {
    render(<CustomizeExportPage />);

    // Assert that the component renders
    // Mock the anchor click function to prevent actual navigation
    const anchorClickMock = jest.fn();
    const originalCreateElement = document.createElement;
    document.createElement = (tagName) => {
        if (tagName === 'a') {
            return {
                click: anchorClickMock,
                setAttribute: jest.fn(),
                removeAttribute: jest.fn(),
            };
        }
        return originalCreateElement(tagName);
    };

    // Find the "Export" button and click it
    const exportButton = screen.getByText('Download (.json)');
    fireEvent.click(exportButton);

    // Assert that the anchor click function was called
    expect(anchorClickMock).toHaveBeenCalled();
});
