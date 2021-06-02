import {NextApiRequest, NextApiResponse} from "next";

import {updateStudentOnDates} from "../../../src/database/update/attendance";

async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (!req.query.student_id) {
		res.statusCode = 400;
		res.end();

		return;
	}

	if (req.method === "PUT") {
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
	} else {
		res.statusCode = 405;
		res.end();
	}
}

export default handler;
