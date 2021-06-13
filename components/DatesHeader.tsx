import {Center, Th} from "@chakra-ui/react";
import React from "react";

import {getFullDate} from "../src/date";

type Parameters = {
	dates: Date[]
};

function DatesHeader({dates}: Parameters) {
	const years = dates.reduce((years: number[], date: Date) => {
		const year = date.getFullYear();
		return [...years, year];
	}, []);

	return (
		<>
			{dates.map((date) => {
				return (
					<Th key={date.toString()}>
						<Center>{getFullDate(date, years.length > 1 ? 1 : 0)}</Center>
					</Th>
				);
			})}
		</>
	);
}

export default DatesHeader;
