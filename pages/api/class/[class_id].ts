import {NextApiRequest, NextApiResponse} from "next";

import {updateStudentOnDates} from "../../../src/database/update/attendance";

async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (!req.query.class_id || isNaN(parseInt(req.query.class_id as string))) {
		res.statusCode = 400;
		res.end();

		return;
	}

	if (req.method === "PUT") {
		// let user = supabase.auth.api.getUserByCookie(req);

		const students = Object.keys(req.body);

		for (const student of students) {
			const dates: Date[] = [];
			const attendances: boolean[] = [];

			const keys = Object.keys(req.body[student]);

			for (const date of keys) {
				dates.push(new Date(date));
				attendances.push(req.body[student][date]);
			}

			await updateStudentOnDates(student, dates, attendances);
		}

		res.statusCode = 200;
		res.end();
	} else {
		res.statusCode = 405;
		res.end();
	}
}

export default handler;
