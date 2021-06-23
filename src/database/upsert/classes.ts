/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import supabase from "../../server";

async function upsertClass(class_id: number, class_name: string, level_id: number): Promise<boolean> {
	try {
		const {error} = await supabase
			.from("classes")
			.upsert({
				class_id,
				class_name,
				level_id
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
	upsertClass
};
