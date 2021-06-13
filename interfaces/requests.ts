import {NextApiRequest} from "next";

export type NextStudentApiRequest = NextApiRequest & {
	query: {
		student_id: string
	}
};

export type NextClassApiRequest = NextApiRequest & {
	query: {
		class_id: string
	}
};
