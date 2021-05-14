import {Record} from "../../../interfaces";

import supabase from "../../server";

async function record(record_id: number): Promise<Record | null> {
	try {
		let {data, error} = await supabase
			.from<Record>("attendance_record")
			.select("record_id, date, student_id, attendance")
			.filter("record_id", "eq", record_id)
			.limit(1);

		if (error || !data || !data[0]) {
			throw error || new Error("No Data");
		}

		return data[0];
	} catch (error) {
		console.warn(error);
		return null;
	}
}

async function recordId(date: Date, student_id: string): Promise<number | null> {
	try {
		let {data, error} = await supabase
			.from<Record>("attendance_record")
			.select("record_id, date, student_id, attendance")
			.eq("date", date.toISOString())
			.eq("student_id", student_id)
			.limit(1);

		if (error || !data || !data[0]) {
			throw error || new Error("No Data");
		}

		return data[0].record_id;
	} catch (error) {
		console.warn(error);
		return null;
	}
}

async function recordsAllByDate(date: number): Promise<Record[] | null> {
	try {
		let {data, error} = await supabase
			.from<Record>("attendance_record")
			.select("record_id, date, student_id, attendance")
			.filter("date", "eq", date)
			.order("record_id", {ascending: true});

		if (error || !data) {
			throw error || new Error("No Data");
		}

		return data;
	} catch (error) {
		console.warn(error);
		return null;
	}
}

async function recordsAllByStudent(student_id: string): Promise<Record[] | null> {
	try {
		let {data, error} = await supabase
			.from<Record>("attendance_record")
			.select("record_id, date, student_id, attendance")
			.filter("student_id", "eq", student_id)
			.order("record_id", {ascending: true});

		if (error || !data) {
			throw error || new Error("No Data");
		}

		return data;
	} catch (error) {
		console.warn(error);
		return null;
	}
}

export {
	record,
	recordId,
	recordsAllByDate,
	recordsAllByStudent
};
