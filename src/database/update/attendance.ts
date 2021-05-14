import supabase from "../../server";
import {studentsAllByClassId} from "../read/students";
import {recordId} from "../read/records";

async function updateStudentOnDate(student_id: string, date: Date, attendance: boolean): Promise<boolean> {
	try {
		let record_id = await recordId(date, student_id);

		const {data, error} = typeof record_id === "number" ? await supabase
			.from("attendance_record")
			.update({
				record_id,
				date,
				student_id,
				attendance
			})
				.eq("record_id", record_id) : await supabase
			.from("attendance_record")
			.insert({
				date: date,
				student_id,
				attendance
			});

		if (error || !data) {
			throw error || new Error("No Data");
		}

		return true;
	} catch (error) {
		console.warn(error);
		return false
	}
}

async function updateStudentOnDates(student_id: string, dates: Date[], attendances: boolean[]): Promise<boolean> {
	if (dates.length == attendances.length) {
		let success = true;
		for (const date of dates) {
			const index = dates.indexOf(date);
			success = success && await updateStudentOnDate(student_id, date, attendances[index]);
			if (!success) {
				return false;
			}
		}
		return true;
	}
	return false;
}

async function updateStudentsOnDate(student_ids: string[], date: Date, attendances: boolean[]): Promise<boolean> {
	if (student_ids.length === attendances.length) {
		let success = true;
		for (const student_id of student_ids) {
			const index = student_ids.indexOf(student_id);
			success = success && await updateStudentOnDate(student_id, date, attendances[index]);
			if (!success) {
				return false;
			}
		}
		return true;
	}
	return false;
}

async function updateStudentsOnDates(student_ids: string[], dates: Date[][], attendances: boolean[][]) {
	if (student_ids.length === dates.length && dates.length === attendances.length) {
		let success = true;
		for (const student_id of student_ids) {
			const index = student_ids.indexOf(student_id);
			success = success && await updateStudentOnDates(student_id, dates[index], attendances[index]);
			if (!success) {
				return false;
			}
		}
		return true;
	}
	return false;
}

async function updateClassOnDate(class_id: number, date: Date, attendances: boolean[]): Promise<boolean> {
	let students = await studentsAllByClassId(class_id);
	if (!students) {
		return false;
	}
	return updateStudentsOnDate(students.map(({student_id}) => student_id), date, attendances);
}

async function updateClassOnDates(class_id: number, dates: Date[], attendances: boolean[][]): Promise<boolean> {
	if (dates.length === attendances.length) {
		let success = true;
		for (const date of dates) {
			const index = dates.indexOf(date);
			success = success && await updateClassOnDate(class_id, dates[index], attendances[index]);
			if (!success) {
				return false;
			}
		}
		return true;
	}
	return false;
}

export {
	updateClassOnDate,
	updateClassOnDates,
	updateStudentOnDate,
	updateStudentOnDates,
	updateStudentsOnDate,
	updateStudentsOnDates
};
