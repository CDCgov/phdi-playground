import React from 'react';
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from '@testing-library/react';
import UploadTutorial from "../app/upload_tutorial/page";

// Mock the useRouter hook from Next.js
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
    useRouter() {
        return {
            push: mockPush,
        };
    },
}));

describe('UploadTutorial', () => {
    // Clear all mocks before each test
    beforeEach(() => {
        mockPush.mockClear();
    });

    it('renders without crashing', () => {
        // Render the UploadTutorial component
        render(<UploadTutorial />);

        // Check that the main elements are present
        expect(screen.getByText('eCR Viewer Tool')).toBeInTheDocument();
        expect(screen.getByText('Easily find the information you need from an eCR')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Get started' })).toBeInTheDocument();
    });

    it('navigates to "/upload_file" when the "Get Started" button is clicked', () => {
        // Render the UploadTutorial component
        render(<UploadTutorial />);

        // Find the button and click it
        const getStartedButton = screen.getByRole('button', { name: 'Get started' });
        fireEvent.click(getStartedButton);

        // Expect the push function to have been called with the correct path
        expect(mockPush).toHaveBeenCalledWith('/upload_file');
    });
});





