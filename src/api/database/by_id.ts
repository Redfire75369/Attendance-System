import {StudentAttendance, StudentData} from "../../../interfaces";
import database from "../server";

export default async function studentById(student_id: string): Promise<StudentAttendance | null> {
	let data = await (await database).get<StudentData>(`SELECT * FROM students where student_id='${student_id}'`);
	if (data === undefined) {
		return null;
	}

	return {
		family_id: data.student_id.substr(0, 4),
		identifier: data.student_id[4],
		name: data.student_name,
		class_id: data.class_id
	};
};

