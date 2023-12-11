import {Table} from '@trussworks/react-uswds'
import _ from 'lodash';

export default function ECRTable({ecrData}: any) {

	const options = ['patient_id', 'first_name', 'last_name', 'gender', 'birth_date']


	const getTableBody = (data: any) => {
		return (
			<tbody>
			{data && options.map(function (option) {
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
		<Table className={'usa-table'}
					 bordered
					 fullWidth>
			<thead>
			<tr>
				<th scope="col">Field Name</th>
				<th scope="col">Field Value</th>
			</tr>
			</thead>
			
			{getTableBody(ecrData?.processed_values?.parsed_values)}
		</Table>
	)
}