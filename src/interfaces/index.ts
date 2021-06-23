/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {User} from "@supabase/supabase-js";

export type Attendance = {
	[date: string]: boolean
};

export type Student = {
	student_id: string,
	student_name: string,
	class_id: number
};

export type StudentWithClassName = Student & {
	class: {
		class_name: string
	}
};

export type Class = {
	class_id: number,
	class_name: string,
	level_id: number
};

export type Record = {
	record_id: number,
	date: string,
	student_id: string,
	attendance: boolean
};

export type AttendanceUser = User & {
	permissions: Permissions
};

export type Permissions = {
	admin: boolean
};

export * from "./requests";
