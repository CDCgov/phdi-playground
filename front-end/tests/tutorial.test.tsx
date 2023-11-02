import React from 'react';
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from '@testing-library/react';
import UploadTutorial from "../app/upload_tutorial/page";
import useRouter from 'next/navigation'

// Mock the useRouter from 'next/navigation'
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

describe('UploadTutorial', () => {
    it('renders the component', () => {
        const { getByText } = render(<UploadTutorial />);
        expect(getByText('eCR Viewer Tool')).toBeInTheDocument();
        expect(getByText('Easily see only the information you need in an eCR')).toBeInTheDocument();
    });

    it('handles the "Get Started" button click', () => {
        const { getByText } = render(<UploadTutorial />);
        const button = getByText('Get Started');

        // Simulate a button click
        fireEvent.click(button);

        // Expect that the router push function was called with the correct path
        expect(require('next/navigation').useRouter().push).toHaveBeenCalledWith('/upload_file');
    });
});