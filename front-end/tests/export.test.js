import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import "@testing-library/jest-dom";
import ExportPage from '../app/export/page'; // Adjust the import path as needed

// Mock the DataContext module
jest.mock('../utils/DataContext', () => ({
    useData: () => ({
        data: {
            "name": "this is a test"
        },
    }),
}));

global.URL.createObjectURL = jest.fn();
global.URL.revokeObjectURL = jest.fn();

describe("Export Page", () => {
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
    const exportButton = screen.getByText('Export');
    fireEvent.click(exportButton);

    // Assert that the anchor click function was called
    expect(anchorClickMock).toHaveBeenCalled();
});
