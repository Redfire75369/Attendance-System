import {ParsedUrlQuery} from "querystring";

function assembleRedirect(path: string, permanent: boolean = false) {
	return {
		redirect: {
			destination: path,
			permanent
		}
	}
}

function parseBrowserQuery(query: ParsedUrlQuery) {
	return {
		page: !isNaN(parseInt(query.page as string)) ? parseInt(query.page as string) : 1,
		search:  query.q !== undefined ? query.q as string : ""
	};
}

export {
	assembleRedirect,
	parseBrowserQuery
};
