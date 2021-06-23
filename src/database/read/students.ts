/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {Student, StudentWithClassName} from "../../interfaces";

import supabase from "../../server";

async function studentById(student_id: string): Promise<Student | null> {
	try {
		let {data, error} = await supabase
			.from<Student>("students")
			.select("student_id, student_name, class_id")
			.eq("student_id", student_id)
			.limit(1)
			.single();

		if (error || !data) {
			throw error || new Error("No Data");
		}
		return data;
	} catch (error) {
		console.warn(error);
		return null;
	}
}

async function studentsAllByClassId(class_id: number): Promise<Student[]> {
	try {
		let {data, error} = await supabase
			.from<Student>("students")
			.select("student_id, student_name, class_id")
			.eq("class_id", class_id)
			.order("student_id", {ascending: true});

		if (error || !data) {
			throw error || new Error("No Data");
		}
		return data;
	} catch (error) {
		console.warn(error);
		return [];
	}
}

async function studentsAll(): Promise<Student[]> {
	try {
		let {data, error} = await supabase
			.from<Student>("students")
			.select("student_id, student_name, class_id")
			.order("student_id", {ascending: true});

		if (error || !data) {
			throw error || new Error("No Data");
		}
		return data;
	} catch (error) {
		console.warn(error);
		return [];
	}
}

async function studentsWithClassNamesAll(): Promise<StudentWithClassName[]> {
	try {
		let {data, error} = await supabase
			.from<StudentWithClassName>("students")
			.select("student_id, student_name, class_id, class:classes (class_name)")
			.order("student_id", {ascending: true});

		if (error || !data) {
			throw error || new Error("No Data");
		}
		return data;
	} catch (error) {
		console.warn(error);
		return [];
	}
}

async function studentIdsAll(): Promise<string[]> {
	let data = await studentsAll();
	return data.map(({student_id}) => student_id);
}

export {
	studentById,
	studentsAll,
	studentsAllByClassId,
	studentIdsAll,
	studentsWithClassNamesAll
};
