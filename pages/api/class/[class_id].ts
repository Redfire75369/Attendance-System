/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {NextApiResponse} from "next";

import {NextClassApiRequest} from "../../../src/interfaces";

import {classById} from "../../../src/database/read/classes";
import {upsertClass} from "../../../src/database/upsert/classes";
import {isValidId} from "../../../src/utils";
import {deleteClass} from "../../../src/database/delete/classes";

async function handler(req: NextClassApiRequest, res: NextApiResponse) {
	if (req.method !== "GET" && req.method !== "PUT" && req.method !== "DELETE") {
		res.setHeader("Allow", "GET,PUT,DELETE");
		res.status(405).end();
		return;
	}

	// let user = await getUser(req);

	if (req.method === "GET") {
		const class_ = await classById(parseInt(req.query.class_id));

		res.setHeader("Content-Type", "application/json");
		res.status(class_ !== null ? 200 : 404).json({class: class_});
	} else if (req.method === "PUT") {
		if (typeof req.body?.class?.class_id !== "number" || !isValidId(req.body?.class?.class_id) || typeof req.body?.class?.class_name !== "string" || typeof req.body?.class?.level_id !== "number" || !isValidId(req.body?.class?.level_id)) {
			res.status(400).end();
			return;
		} else if (parseInt(req.query.class_id) !== req.body.class.class_id) {
			console.log(2);
			res.status(400).end();
			return;
		}

		const {class_id, class_name, level_id} = req.body.class;

		if (await upsertClass(class_id, class_name, level_id)) {
			res.status(200).end();
		} else {
			res.status(500).end();
		}
	} else if (req.method === "DELETE") {
		if (isValidId(parseInt(req.query.class_id)) && await deleteClass(parseInt(req.query.class_id))) {
			res.status(200).end();
		} else {
			res.status(500).end();
		}
	}
}

export default handler;
