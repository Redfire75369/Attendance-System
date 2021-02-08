export type StudentAttendance = {
	family_id: string,
	identifier: string,
	name: string,
	class_id: number,
}

export type StudentData = {
	student_id: string,
	student_name: string,
	class_id: number,
};

export type RecordData = {
	record_id: number,
	date: number,
	student_id: string,
	attendance: boolean,
}

export type ClassData = {
	class_id: number,
	class_name: string,
	level_id: number,
}
