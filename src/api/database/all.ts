import database from "../server";
import {StudentAttendance, StudentData} from "../../../interfaces";


export default async function attendanceAll(): Promise<StudentAttendance[]> {
	let data = await (await database).all<StudentData[]>(`SELECT * FROM students`);
	if (data === undefined) {
		return [];
	}

	return data.map(({class_id, student_id, student_name}) => ({
		family_id: student_id.substr(0, 4),
		identifier: student_id[4],
		name: student_name,
		class_id: class_id,
	}));
}

export async function attendanceIdsAll(): Promise<string[]> {
	let data = await attendanceAll();

	return data.map(({family_id, identifier}) => family_id + identifier);
}
