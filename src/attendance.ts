import {startOfDay, subDays} from "date-fns";

import {recordsAllByStudent} from "./database/read/records";
import {Attendance} from "../interfaces";

async function getStudentAttendanceOnDates(student_id: string, dates: Date[]) {
	const records = await recordsAllByStudent(student_id);
	const attendance: Attendance = {};

	const datesWithAttendance = records.map(function({date}) {
		return (startOfDay(new Date(date))).toString();
	});

	dates.forEach(function(date) {
		let index = datesWithAttendance.indexOf(subDays(date, 1).toString());
		attendance[date.toString()] = index === -1 ? false : records[index].attendance;
	});

	return attendance;

}

export {
	getStudentAttendanceOnDates
};
