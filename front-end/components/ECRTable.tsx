import {Table} from '@trussworks/react-uswds'
import _ from 'lodash';

export default function ECRTable({ecrData}) {
	const options = ['patient_id', 'first_name', 'last_name', 'gender', 'birth_date']

	console.log(ecrData);

	const getTableBody = (data: any) => {
		return (
			<tbody>
			{options.map(function (option) {
				return (
					<tr key={option}>
						<th scope="row">{_.startCase(option)}</th>
						<td>{data[option]}</td>
					</tr>
				);
			})}

			</tbody>
		)
	}

	return (
		<div className='margin-3'>
			{/*<h1>eCR Viewer</h1>*/}
			<div>
				<Table
					bordered
					// caption="This table uses the fullWidth prop to increase to 100% width"
					fullWidth>
					<thead>
					<tr>
						<th scope="col">Field Name</th>
						<th scope="col">Field Value</th>
					</tr>
					</thead>
					{getTableBody(ecrData.processed_values.parsed_values)}
				</Table>
			</div>
		</div>
	)
}