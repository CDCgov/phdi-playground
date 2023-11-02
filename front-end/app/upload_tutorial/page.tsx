'use client'
import { ProcessList, ProcessListItem, ProcessListHeading, Button } from '@trussworks/react-uswds'
import { useRouter } from 'next/navigation';

export default function upload_tutorial() {
    const router = useRouter();


    const handleClick = () => {
        router.push('/upload_file')
    }

    return (
        <div className="margin-3">
            <h1 className="font-sans-2xl text-bold">eCR Viewer Tool</h1>
            <h2 className="font-sans-lg text-light">Easily see only the information you need in an eCR</h2>
            <ProcessList>
                <ProcessListItem>
                    <ProcessListHeading type="h4">Upload your eCR</ProcessListHeading>
                    <p className="margin-top-05 font-sans-xs">
                        We currently accept one .zip file at a time (bulk eCR upload coming soon).
                    </p>
                </ProcessListItem>
                <ProcessListItem>
                    <ProcessListHeading type="h4">
                        See the progress of your eCR through our pipeline
                    </ProcessListHeading>
                    <p className="font-sans-xs">
                        We process your eCR through our data ingestion pipeline, which standardizes, cleans, and geocodes the data.
                    </p>
                </ProcessListItem>
                <ProcessListItem>
                    <ProcessListHeading type="h4">
                        View and download your transformed eCR data
                    </ProcessListHeading>
                    <p className="font-sans-xs">
                        We provide the option to view your eCR directly in our tool or download the data as a JSON file.
                    </p>
                </ProcessListItem>
            </ProcessList>
            <Button type="button" onClick={handleClick}>Get Started</Button>
        </div>
    )
}
