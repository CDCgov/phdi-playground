'use client'
import {Button} from '@trussworks/react-uswds'
import ECRTable from '@/components/ECRTable';
import React from "react";

export default function ViewECR() {
	// const {data} = useData()
	const data = {
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

	return (
		<div className="margin-3">
			<h1 className={'font-sans-xl text-bold'}>View your eCR</h1>
			<p>
				You can view your data below or download it as a FHIR bundle (JSON file).
			</p>
			<ECRTable ecrData={data}></ECRTable>
			<Button type="button">Upload new eCR</Button>
			<Button type="button">Download FHIR bundle</Button>
		</div>
	)
}
