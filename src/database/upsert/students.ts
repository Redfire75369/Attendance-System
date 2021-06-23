/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import supabase from "../../server";

async function upsertStudent(student_id: string, student_name: string, class_id: number) {
	try {
		console.log(student_id, student_name, class_id);

		const {error} = await supabase
			.from("students")
			.upsert({
				student_id,
				student_name,
				class_id
			}, {
				returning: "minimal",
				count: null
			});

		if (error) {
			throw error;
		}
		return true;
	} catch (error) {
		console.warn(error);
		return false
	}
}

export {
	upsertStudent
};
