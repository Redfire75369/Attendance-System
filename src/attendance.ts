import {startOfDay} from "date-fns";

import {Attendance} from "../interfaces";

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
