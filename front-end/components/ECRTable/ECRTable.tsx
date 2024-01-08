import {
	Table
} from '@trussworks/react-uswds'
import _ from 'lodash';
import { v4 } from 'uuid';


export default function ECRTable({ ecrData }: any) {
	const tableData = ecrData?.processed_values?.parsed_values
	// remove null fields
	Object.keys(tableData || {}).forEach((k) => tableData[k] == null && delete tableData[k])
	const options = Object.keys(tableData || {});
	const arrayOptions = options.filter((option) => Array.isArray(tableData[option]))
	// remove array fields from options
	arrayOptions.forEach(arrayOption => {options.splice(options.indexOf(arrayOption), 1)})
	const formatHeader = (innerOption: string) => _.startCase(innerOption)
		.replace(/rr /i, "RR ")
		.replace(/eicr /i, "eICR ")
		.replace(/ecr /i, "eCR ");

	const getArrayTableHeader = (data: [{[key: string]: any}]) => {
		const innerOptions = data.length > 0 && Object.keys(data[0] || {}) || [];

		return (
			<thead>
				<tr>
					{innerOptions.map(innerOption => <th scope="col" key={v4()}>{formatHeader(innerOption)}</th>)}
				</tr>
			</thead>
		)
	}

	const getArrayTableBody = (data: [{[key: string]: any}]) => {
		const innerOptions = data.length > 0 && Object.keys(data[0] || {}) || [];

		return (
			<tbody>
			{data.map(entry => (
				<tr key={v4()}>
					{innerOptions.map(option => {
						return (<th scope="row" key={v4()}>{entry[option]}</th>)
					})}
				</tr>
			))}

			</tbody>
		)
	}

	const getTableBody = (data: any) => {
		Object.keys(data || {}).forEach((k) => data[k] == null && delete data[k])
		const innerOptions = Object.keys(data || {});
		const innerArrayOptions = innerOptions.filter((option) => Array.isArray(data[option]))
		innerArrayOptions.forEach(arrayOption => {innerOptions.splice(innerOptions.indexOf(arrayOption), 1)})
		return (
			<tbody>
			{data && innerOptions.map(function (option) {
				return (
					<tr key={option}>
						<th scope="row">{formatHeader(option)}</th>
						<td>{data[option]}</td>
					</tr>
				);
			})}

			</tbody>
		)
	}

	return (
		<div className='margin-top-3'>
			<h1>eCR Viewer</h1>
			<div>
				<Table
					bordered
					caption="This table uses the fullWidth prop to increase to 100% width"
					fullWidth>
					<thead>
					<tr>
						<th scope="col">Field Name</th>
						<th scope="col">Field Value</th>
					</tr>
					</thead>
					{getTableBody(tableData)}
				</Table>
			</div>
			{arrayOptions.map(option => {
				return (
					<div key={option}>
						<h2>{formatHeader(option)}</h2>
						<div>
							<Table
								bordered
								scrollable
								fullWidth
								className="no-wrap-table"
							>
								{getArrayTableHeader(tableData[option])}
								{getArrayTableBody(tableData[option])}
							</Table>
						</div>
					</div>)
			})}
		</div>
	)
}