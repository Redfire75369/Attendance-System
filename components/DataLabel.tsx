import React from 'react';

import {getFullDate} from "../src/date";

type Parameters = {
	dates: Date[]
};

function DataLabel({dates}: Parameters) {
	const years = dates.reduce((years: number[], date: Date) => {
		const year = date.getFullYear();
		return [...years, year];
	}, []);

	return (
		<tr>
			<td>ID</td>
			<td>Name</td>
			<td>Class</td>
			{dates.map((date) => {
				return <td key={date.toString()}>{getFullDate(date, years.length > 1 ? 1 : 0)}</td>;
			})}
		</tr>
	);
}

export default DataLabel;
