'use client'
import {Button} from '@trussworks/react-uswds'
import ECRTable from '@/components/ECRTable';
import React from "react";
import {useRouter} from "next/router";
import {useData} from "@/utils/DataContext";


export default function ViewECR() {
	const router = useRouter()
	const {data} = useData()

	if (!data) {
		return <div>No data available.</div>
	}

	const handleUploadClick = () => {
		router.push('/upload_tutorial')
	}

	const handleDownloadClick = () => {
		router.push('/export')
	}

	return (
		<div className="margin-3">
			<h1 className={'font-sans-xl text-bold'}>View your eCR</h1>
			<p>
				You can view your data below or download it as a FHIR bundle (JSON file)
			</p>
			<ECRTable ecrData={data}></ECRTable>
			<Button type="button" outline onClick={handleUploadClick}>Upload new eCR</Button>
			<Button type="button" onClick={handleDownloadClick}>Download FHIR bundle</Button>
		</div>
	)
}
