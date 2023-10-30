'use client'
import {Button} from '@trussworks/react-uswds'

export default function ViewECR() {
	return (
		<div className="margin-3">
			<h1>View your eCR</h1>
			<p>
				You can view your data below or download it as a FHIR bundle (JSON file).
			</p>

			{/*<ECRTable>*/}
			{/*</ECRTable>*/}

			<Button type="button">Upload new eCR</Button>
			<Button type="button">Download FHIR bundle</Button>
		</div>
	)
}
