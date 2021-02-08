import type {NextApiRequest, NextApiResponse} from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	console.log(req);

	if (req.method === "GET") {
		res.statusCode = 200
		res.setHeader("Content-Type", "application/json");
		res.end();
	}
}
