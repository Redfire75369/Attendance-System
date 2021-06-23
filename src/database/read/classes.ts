/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {Class} from "../../interfaces";

import supabase from "../../server";
import {studentsAll} from "./students";

async function classById(class_id: number): Promise<Class | null> {
	try {
		let {data, error} = await supabase
			.from<Class>("classes")
			.select("class_id, class_name, level_id")
			.eq("class_id", class_id)
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

async function classNameById(class_id: number): Promise<string> {
	let data = await classById(class_id);
	return data !== null ? data.class_name : "";
}

async function classesAll(): Promise<Class[]> {
	try {
		let {data, error} = await supabase
			.from<Class>("classes")
			.select("class_id, class_name, level_id")
			.order("class_id", {ascending: true});

		if (error || !data) {
			throw error || new Error("No Data");
		}
		return data;
	} catch (error) {
		console.warn(error);
		return [];
	}
}

async function classIdsAll(): Promise<number[]> {
	let data = await studentsAll();

	return data.map(({class_id}) => class_id);
}

export {
	classById,
	classesAll,
	classIdsAll,
	classNameById
};
