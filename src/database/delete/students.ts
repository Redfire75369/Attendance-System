/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import supabase from "../../server";

async function deleteStudent(student_id: string) {
	try {
		const {error} = await supabase
			.from("students")
			.delete({
				returning: "minimal",
				count: null
			})
			.eq("student_id", student_id);

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
	deleteStudent
};
