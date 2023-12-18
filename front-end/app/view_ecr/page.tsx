'use client'
import {Button} from '@trussworks/react-uswds'
import ECRTable from '@/components/ECRTable';
import React from "react";
import {useData} from '@/utils/DataContext';

export default function ViewECR() {
	const {data} = useData()

	if (!data) {
		return <div>No data available.</div>
	}

	return (
		<div className="margin-3">
			<h1 className={'font-sans-xl text-bold'}>View your eCR</h1>
			<p>
				You can view your data below or download it as a FHIR bundle (JSON file).
			</p>
			<ECRTable ecrData={data}></ECRTable>
			<Button type="button" outline>Upload new eCR</Button>
			<Button type="button">Download FHIR bundle</Button>
		</div>
	)
}
