/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {getDate, getMonth, getYear} from "date-fns";

function getFullDate(date: Date, includesYear: number = 0): string {
	const day = getDate(date);
	const month = getMonth(date) + 1;
	switch (includesYear) {
		case 0: {
			return `${day < 10 ? "0" + day : day}/${month < 10 ? "0" + month : month}`;
		}
		case 1: {
			return `${day < 10 ? "0" + day : day}/${month < 10 ? "0" + month : month}/${getYear(date) % 100}`;
		}
		case 2: {
			return `${day < 10 ? "0" + day : day}/${month < 10 ? "0" + month : month}/${getYear(date)}`;
		}
		default: {
			return "";
		}
	}
}

function getISODate(date: Date): string {
	const day = getDate(date);
	const month = getMonth(date) + 1;
	return `${getYear(date)}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`;
}

export {
	getFullDate,
	getISODate
};
