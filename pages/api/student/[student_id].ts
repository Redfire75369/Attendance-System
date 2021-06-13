import {NextApiRequest, NextApiResponse} from "next";

import {updateStudentOnDates} from "../../../src/database/update/attendance";

async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "PUT") {
		res.setHeader("Allow", "PUT");
		res.status(405).end();
		return;
	}

	if (!req.query.student_id) {
		res.status(400).end();
		return;
	}

	// let user = supabase.auth.api.getUserByCookie(req);

	let dates: Date[] = [];
	let attendances: boolean[] = [];

	let keys = Object.keys(req.body);

	for (const date of keys) {
		dates.push(new Date(date));
		attendances.push(req.body[date]);
	}

	await updateStudentOnDates(req.query.student_id as string, dates, attendances);

	res.statusCode = 200;
	res.end();
}

export default handler;
