/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {NextApiResponse} from "next";

import {NextStudentApiRequest} from "../../../src/interfaces";

import {studentById} from "../../../src/database/read/students";
import {classNameById} from "../../../src/database/read/classes";
import {upsertStudent} from "../../../src/database/upsert/students";
import {isValidId} from "../../../src/utils";
import {deleteStudent} from "../../../src/database/delete/students";

async function handler(req: NextStudentApiRequest, res: NextApiResponse) {
	if (req.method !== "GET" && req.method !== "PUT" && req.method !== "DELETE") {
		res.setHeader("Allow", "GET,PUT,DELETE");
		res.status(405).end();
		return;
	}

	// let user = await getUser(req);

	if (req.method === "GET") {
		const student = await studentById(req.query.student_id);
		const className = student?.class_id ? await classNameById(student.class_id) : null;

		if (student !== null) {
			res.setHeader("Content-Type", "application/json");
			res.status(200).json({
				student,
				class: {
					class_name: className
				}
			});
		} else {
			res.status(404).end();
		}
	} else if (req.method === "PUT") {
		if (typeof req.body?.student?.student_id !== "string" || typeof req.body?.student?.student_name !== "string" || typeof req.body?.student?.class_id !== "number" || !isValidId(req.body?.student?.class_id)) {
			res.status(400).end();
			return;
		} else if (req.query.student_id !== req.body.student.student_id) {
			res.status(400).end();
			return;
		}

		const {student_id, student_name, class_id} = req.body.student;

		if (await upsertStudent(student_id, student_name, class_id)) {
			res.status(200).end();
		} else {
			res.status(500).end();
		}
	} else if (req.method === "DELETE") {
		if (await deleteStudent(req.query.student_id)) {
			res.status(200).end();
		} else {
			res.status(500).end();
		}
	}
}

export default handler;
