import database from "./server";
import {studentIdsClassByClassId} from "./database/by_class_id";
import {recordId} from "./database/records";

type idClass = {
	[id: string]: string
}
type classId = {
	[id: string]: number
}

const idToClass: idClass = {
	0: "None",
	1: "Nursery Boys",
	2: "Nursery Girls",
	3: "K1 Boys",
	4: "K1 Girls",
	5: "K2 Boys",
	6: "K2 Girls"
};
const classToId: classId = {
	"None": 0,
	"Nursery Boys": 1,
	"Nursery Girls": 2,
	"K1 Boys": 3,
	"K1 Girls": 4,
	"K2 Boys": 5,
	"K2 Girls": 6
};

async function updateAttendanceOfSingleOnDateSingle(student_id: string, date: number, attendance: boolean) {
	const record_id = await recordId(date, student_id);
	if (record_id != null) {
		await (await database).run(`UPDATE attendance='${attendance}' FROM attendance_record WHERE record_id=${record_id}`);
	} else {
		await (await database).run(`INSERT INTO attendance_record (${date}, ${student_id}, ${attendance}) VALUES (${date}, ${student_id}, '${attendance}')`);
	}
}

async function updateAttendanceOfSingleOnDateMultiple(student_id: string, dates: number[], attendance: boolean[]) {
	if (dates.length == attendance.length) {
		for (const date of dates) {
			const index = dates.indexOf(date);
			await updateAttendanceOfSingleOnDateSingle(student_id, date, attendance[index]);
		}
	}
}

async function updateAttendanceOfMultipleOnDateSingle(student_ids: string[], dates: number[], attendances: boolean[]) {
	if (student_ids.length === dates.length && dates.length === attendances.length) {
		for (const student_id of student_ids) {
			const index = student_ids.indexOf(student_id);
			await updateAttendanceOfSingleOnDateSingle(student_id, dates[index], attendances[index]);
		}
	}
}

async function updateAttendanceOfMultipleOnDateMultiple(student_ids: string[], datess: number[][], attendancess: boolean[][]) {
	if (student_ids.length === datess.length && datess.length === attendancess.length) {
		for (const student_id of student_ids) {
			const index = student_ids.indexOf(student_id);
			await updateAttendanceOfSingleOnDateMultiple(student_id, datess[index], attendancess[index]);
		}
	}
}

async function updateAttendanceOfClassOnDateSingle(class_id: number, dates: number[], attendances: boolean[]) {
	if (dates.length === attendances.length) {
		let student_ids = await studentIdsClassByClassId(class_id);

		await updateAttendanceOfMultipleOnDateSingle(student_ids, dates, attendances);
	}
}

async function updateAttendanceOfClassOnDateMultiple(class_id: number, datess: number[][], attendancess: boolean[][]) {
	if (datess.length === attendancess.length) {
		let student_ids = await studentIdsClassByClassId(class_id);

		await updateAttendanceOfMultipleOnDateMultiple(student_ids, datess, attendancess);
	}
}

export {
	idToClass,
	classToId,
	updateAttendanceOfSingleOnDateSingle,
	updateAttendanceOfSingleOnDateMultiple,
	updateAttendanceOfMultipleOnDateSingle,
	updateAttendanceOfMultipleOnDateMultiple,
	updateAttendanceOfClassOnDateSingle,
	updateAttendanceOfClassOnDateMultiple
};
