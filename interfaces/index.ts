export type Attendance = {
	[date: string]: boolean
};

export type Student = {
	student_id: string,
	student_name: string,
	class_id: number,
};

export type Record = {
	record_id: number,
	date: string,
	student_id: string,
	attendance: boolean,
};

export type Class = {
	class_id: number,
	class_name: string,
	level_id: number,
};
