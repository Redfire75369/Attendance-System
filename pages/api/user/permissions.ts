/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {NextApiRequest, NextApiResponse} from "next";
import getUser from "../../../src/auth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
	const user = await getUser(req);

	if (!user) {
		res.status(401).end();
		return;
	}

	res.setHeader("Content-Type", "application/json");
	res.status(200).json(JSON.stringify(user.permissions));;
}

export default handler;
