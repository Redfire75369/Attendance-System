/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {NextApiRequest} from "next";
import {AttendanceUser, Permissions} from "./interfaces";
import {NextApiRequestCookies} from "next/dist/next-server/server/api-utils";
import {IncomingMessage} from "http";
import supabase from "./server";
import {User} from "@supabase/supabase-js";

async function getUser(req: NextApiRequest | (IncomingMessage & {cookies: NextApiRequestCookies})): Promise<AttendanceUser | null> {
	const {user} = await supabase.auth.api.getUserByCookie(req);
	if (!user) {
		return null;
	}

	const permissions = await getPermissions(user);

	return {
		...user,
		permissions
	};
}

async function getPermissions(_: User): Promise<Permissions> {
	return {
		admin: true
	};
}

export default getUser;
