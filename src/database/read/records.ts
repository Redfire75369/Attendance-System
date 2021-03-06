/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {Record} from "../../interfaces";

import supabase from "../../server";
import {format} from "date-fns";

async function record(record_id: number): Promise<Record | null> {
	try {
		let {data, error} = await supabase
			.from<Record>("attendance_record")
			.select("record_id, date, student_id, attendance")
			.eq("record_id", record_id)
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

async function recordId(date: Date, student_id: string): Promise<number | null> {
	try {
		let {data, error} = await supabase
			.from<Record>("attendance_record")
			.select("record_id, date, student_id, attendance")
			.eq("date", format(date, "yyyy-MM-dd"))
			.eq("student_id", student_id)
			.limit(1)
			.single();

		if (error || !data) {
			throw error || new Error("No Data");
		}
		return data.record_id;
	} catch (error) {
		console.warn(error);
		return null;
	}
}

async function recordsAllByDate(date: number): Promise<Record[]> {
	try {
		let {data, error} = await supabase
			.from<Record>("attendance_record")
			.select("record_id, date, student_id, attendance")
			.eq("date", format(date, "yyyy-MM-dd"))
			.order("record_id", {ascending: true});

		if (error || !data) {
			throw error || new Error("No Data");
		}
		return data;
	} catch (error) {
		console.warn(error);
		return [];
	}
}

async function recordsAllByStudent(student_id: string): Promise<Record[]> {
	try {
		let {data, error} = await supabase
			.from<Record>("attendance_record")
			.select("record_id, date, student_id, attendance")
			.eq("student_id", student_id)
			.order("record_id", {ascending: true});

		if (error || !data) {
			throw error || new Error("No Data");
		}
		return data;
	} catch (error) {
		console.warn(error);
		return [];
	}
}

export {
	record,
	recordId,
	recordsAllByDate,
	recordsAllByStudent
};
