/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

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
