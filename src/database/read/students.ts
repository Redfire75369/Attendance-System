import {Student} from "../../../interfaces";

import supabase from "../../server";

async function studentById(student_id: string): Promise<Student | null> {
	try {
		let {data, error} = await supabase
			.from<Student>("students")
			.select("student_id, student_name, class_id")
			.filter("student_id", "eq", student_id)
			.limit(1);

		if (error || !data || !data[0]) {
			throw error || new Error("No Data");
		}
		return data[0];
	} catch (error) {
		console.warn(error);
		return null;
	}
};

async function studentsAllByClassId(class_id: number): Promise<Student[]> {
	try {
		let {data, error} = await supabase
			.from<Student>("students")
			.select("student_id, student_name, class_id")
			.filter("class_id", "eq", class_id)
			.order("student_id", {ascending: true});

		if (error || !data) {
			throw error || new Error("No Data");
		}
		return data;
	} catch (error) {
		console.warn(error);
		return [];
	}
};

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

async function studentIdsAll(): Promise<string[]> {
	let data = await studentsAll();
	return data.map(({student_id}) => student_id);
}

export {
	studentById,
	studentsAll,
	studentsAllByClassId,
	studentIdsAll
};
