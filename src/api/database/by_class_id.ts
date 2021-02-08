import {StudentAttendance, StudentData} from "../../../interfaces";
import database from "../server";


export default async function studentsClassByClassId(class_id: number): Promise<StudentAttendance[] | null> {
	let data = await (await database).all<StudentData[]>(`SELECT * FROM students where class_id=${class_id}`);
	if (data === undefined) {
		return null;
	}

	return data.map(({class_id, student_id, student_name}) => ({
		family_id: student_id.substr(0, 4),
		identifier: student_id[4],
		name: student_name,
		class_id: class_id
	}));
};

export async function studentIdsClassByClassId(class_id: number): Promise<string[]> {
	let data = await studentsClassByClassId(class_id);
	if (data === null) {
		return [];
	}

	return data.map(({family_id, identifier}) => family_id + identifier);
}
