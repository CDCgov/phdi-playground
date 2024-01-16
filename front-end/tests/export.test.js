import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import "@testing-library/jest-dom";
import ExportPage from '../app/export/page'; // Adjust the import path as needed
import { useRouter } from 'next/router';

// Mock the useRouter hook from Next.js
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
    useRouter() {
        return {
            push: mockPush,
        };
    },
}));

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

describe("Export Page", () => {
    // Clear all mocks before each test
    beforeEach(() => {
        mockPush.mockClear();
    });    
    it("ExportPage component should render page", () => {
        render(<ExportPage />);
        expect(screen.getByText('Export Page')).toBeInTheDocument();
    });
});

test('ExportPage component should render and trigger download', () => {
    render(<ExportPage />);

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
