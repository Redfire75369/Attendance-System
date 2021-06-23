/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {NextApiRequest, NextApiResponse} from "next";

import {upsertStudentOnDates} from "../../../../src/database/upsert/attendance";

async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "PUT") {
		res.setHeader("Allow", "PUT");
		res.status(405).end();
		return;
	}

	if (!req.query.class_id || isNaN(parseInt(req.query.class_id as string))) {
		res.status(400).end();
		return;
	}

	// let user = await getUser(req);

	const students = Object.keys(req.body);

	for (const student of students) {
		const dates: Date[] = [];
		const attendances: boolean[] = [];

		const keys = Object.keys(req.body[student]);

		for (const date of keys) {
			dates.push(new Date(date));
			attendances.push(req.body[student][date]);
		}

		await upsertStudentOnDates(student, dates, attendances);
	}

	res.status(200).end();
}

export default handler;
