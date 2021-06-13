import {NextApiResponse} from "next";

import {NextStudentApiRequest} from "../../../interfaces";

import {studentById} from "../../../src/database/read/students";

async function handler(req: NextStudentApiRequest, res: NextApiResponse) {
	if (req.method !== "GET") {
		res.setHeader("Allow", "GET");
		res.status(405).end();
		return;
	}

	// let user = supabase.auth.api.getUserByCookie(req);

	const student = await studentById(req.query.student_id);

	res.setHeader("Content-Type", "application/json");
	res.status(student !== null ? 200 : 404).json({student});
}

export default handler;
