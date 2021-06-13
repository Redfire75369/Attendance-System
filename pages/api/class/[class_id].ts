import {NextApiResponse} from "next";

import {NextClassApiRequest} from "../../../interfaces";

import {classById} from "../../../src/database/read/classes";

async function handler(req: NextClassApiRequest, res: NextApiResponse) {
	if (req.method !== "GET") {
		res.setHeader("Allow", "GET");
		res.status(405).end();
		return;
	}

	// let user = supabase.auth.api.getUserByCookie(req);

	const class_ = await classById(parseInt(req.query.class_id));

	res.setHeader("Content-Type", "application/json");
	res.status(class_ !== null ? 200 : 404).json({class: class_});
}

export default handler;
