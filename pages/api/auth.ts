import {NextApiRequest, NextApiResponse} from "next";

import supabase from "../../src/server";

async function handler(req: NextApiRequest, res: NextApiResponse) {
	supabase.auth.api.setAuthCookie(req, res);
}

export default handler;
