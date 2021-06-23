/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

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

function isValidId(id: number | undefined) {
	return id !== undefined && id >= 0 && !isNaN(id);
}

export {
	assembleRedirect,
	isValidId,
	parseBrowserQuery
};
