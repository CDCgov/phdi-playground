'use client'
import { useData } from '@/utils/DataContext';
import { Button } from '@trussworks/react-uswds'

import React from 'react';

export default function ExportPage() {
    const { data } = useData(); // Access the shared data
    const downloadFile = () => {
        // Convert the data object to a JSON string
        const jsonData = JSON.stringify(data);

        // Create a Blob with the JSON data
        const blob = new Blob([jsonData], { type: 'application/json' });

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
        <div className="margin-3">
            <h1>Export Page</h1>
            <Button type="button" onClick={downloadFile}>Export</Button>
        </div>
    );
}