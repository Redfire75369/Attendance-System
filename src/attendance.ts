/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {startOfDay} from "date-fns";

import {Attendance} from "./interfaces";

import {recordsAllByStudent} from "./database/read/records";

async function getStudentAttendanceOnDates(student_id: string, dates: Date[]) {
	const records = await recordsAllByStudent(student_id);
	const attendance: Attendance = {};

	const datesWithRecords = records.map(function({date}) {
		return (startOfDay(new Date(date))).toString();
	});

	dates.forEach(function(date) {
		let index = datesWithRecords.indexOf(date.toString());
		attendance[date.toString()] = index === -1 ? false : records[index].attendance;
	});

	return attendance;

}

export {
	getStudentAttendanceOnDates
};
