/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
	isFriday,
	isMonday,
	isSaturday,
	isSunday,
	isThursday,
	isTuesday,
	isWednesday,
	nextFriday,
	nextMonday,
	nextSaturday,
	nextSunday,
	nextThursday,
	nextTuesday,
	nextWednesday,
	subWeeks
} from "date-fns";

export type Day = 1 | 2 | 3 | 4 | 5 | 6 | 7;

function isDay(day: Day, date: Date): boolean {
	switch (day) {
		case 1:
			return isMonday(date);
		case 2:
			return isTuesday(date);
		case 3:
			return isWednesday(date);
		case 4:
			return isThursday(date);
		case 5:
			return isFriday(date);
		case 6:
			return isSaturday(date);
		case 7:
			return isSunday(date);
		default:
			return false;
	}
}

function nextDay(day: Day, date: Date): Date {
	switch (day) {
		case 1:
			return nextMonday(date);
		case 2:
			return nextTuesday(date);
		case 3:
			return nextWednesday(date);
		case 4:
			return nextThursday(date);
		case 5:
			return nextFriday(date);
		case 6:
			return nextSaturday(date);
		case 7:
			return nextSunday(date);
	}
}

function prevDay(day: Day, date: Date): Date {
	return subWeeks(nextDay(day, date), 1);
}

export {
	isDay,
	nextDay,
	prevDay
};
