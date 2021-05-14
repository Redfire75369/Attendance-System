import {Class} from "../../../interfaces";

import supabase from "../../server";

async function classById(class_id: number): Promise<Class | null> {
	try {
		let {data, error} = await supabase
			.from<Class>("classes")
			.select("class_id, class_name, level_id")
			.filter("class_id", "eq", class_id)
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

async function classNameById(class_id: number): Promise<string | null> {
	let data = await classById(class_id);
	if (data == null) {
		return "";
	}

	return data.class_name;
}

export {
	classById,
	classNameById
};
