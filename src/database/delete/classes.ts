/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import supabase from "../../server";

async function deleteClass(class_id: number) {
	try {
		const {error} = await supabase
			.from("classes")
			.delete({
				returning: "minimal",
				count: null
			})
			.eq("class_id", class_id);

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
	deleteClass
};
