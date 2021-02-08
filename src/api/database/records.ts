import database from "../server";
import {RecordData} from "../../../interfaces";

interface RecordId {
	record_id: number
}

async function record(record_id: number): Promise<RecordData | null> {
	let data = await (await database).get<RecordData>(`SELECT * FROM attendance_record WHERE record_id=${record_id}`);

	if (data === undefined) {
		return null;
	}

	return data;
}

async function recordId(date: number, student_id: string): Promise<number | null> {
	let data = await (await database).get<RecordId>(`SELECT record_id FROM attendance_record WHERE date=${date} AND student_id=${student_id}`);

	if (data === undefined) {
		return null;
	}

	return data.record_id;
}

async function recordsAllByDate(date: number): Promise<RecordData[] | null> {
	let data = await (await database).all<RecordData[]>(`SELECT * FROM attendance_record WHERE student_id=${date}`);

	if (data === undefined) {
		return null;
	}

	return data;
}

async function recordsAllByStudent(student_id: string): Promise<RecordData[] | null> {
	let data = await (await database).all<RecordData[]>(`SELECT * FROM attendance_record WHERE student_id='${student_id}'`);
	if (data === undefined) {
		return null;
	}

	return data;
}

export {
	record,
	recordId,
	recordsAllByDate,
	recordsAllByStudent
};
