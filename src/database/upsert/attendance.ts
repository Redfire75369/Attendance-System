/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {studentsAllByClassId} from "../read/students";
import {recordId} from "../read/records";
import supabase from "../../server";
import {format} from "date-fns";

async function upsertStudentOnDate(student_id: string, date: Date, attendance: boolean): Promise<boolean> {
	try {
		let record_id = await recordId(date, student_id);

		const {data, error} = typeof record_id === "number" ? await supabase.from("attendance_record")
			.update({
				record_id,
				date: format(date, "yyyy-MM-dd"),
				student_id,
				attendance
			}, {
				returning: "minimal",
				count: null
			})
			.eq("record_id", record_id) : await supabase.from("attendance_record")
			.insert({
				date: format(date, "yyyy-MM-dd"),
				student_id,
				attendance
			}, {
				returning: "minimal",
					count: null
			});

		if (error || !data) {
			throw error || new Error("No Data");
		}
		return true;
	} catch (error) {
		console.warn(error);
		return false;
	}
}

async function upsertStudentOnDates(student_id: string, dates: Date[], attendances: boolean[]): Promise<boolean> {
	if (dates.length == attendances.length) {
		let success = true;
		for (const date of dates) {
			const index = dates.indexOf(date);
			success = success && await upsertStudentOnDate(student_id, date, attendances[index]);
			if (!success) {
				return false;
			}
		}
		return true;
	}
	return false;
}

async function upsertStudentsOnDate(student_ids: string[], date: Date, attendances: boolean[]): Promise<boolean> {
	if (student_ids.length === attendances.length) {
		let success = true;
		for (const student_id of student_ids) {
			const index = student_ids.indexOf(student_id);
			success = success && await upsertStudentOnDate(student_id, date, attendances[index]);
			if (!success) {
				return false;
			}
		}
		return true;
	}
	return false;
}

async function upsertStudentsOnDates(student_ids: string[], dates: Date[][], attendances: boolean[][]) {
	if (student_ids.length === dates.length && dates.length === attendances.length) {
		let success = true;
		for (const student_id of student_ids) {
			const index = student_ids.indexOf(student_id);
			success = success && await upsertStudentOnDates(student_id, dates[index], attendances[index]);
			if (!success) {
				return false;
			}
		}
		return true;
	}
	return false;
}

async function upsertClassOnDate(class_id: number, date: Date, attendances: boolean[]): Promise<boolean> {
	let students = await studentsAllByClassId(class_id);
	if (!students) {
		return false;
	}
	return upsertStudentsOnDate(students.map(({student_id}) => student_id), date, attendances);
}

async function upsertClassOnDates(class_id: number, dates: Date[], attendances: boolean[][]): Promise<boolean> {
	if (dates.length === attendances.length) {
		let success = true;
		for (const date of dates) {
			const index = dates.indexOf(date);
			success = success && await upsertClassOnDate(class_id, dates[index], attendances[index]);
			if (!success) {
				return false;
			}
		}
		return true;
	}
	return false;
}

export {
	upsertClassOnDate,
	upsertClassOnDates,
	upsertStudentOnDate,
	upsertStudentOnDates,
	upsertStudentsOnDate,
	upsertStudentsOnDates
};
