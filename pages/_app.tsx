/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {ChakraProvider} from "@chakra-ui/react";

import "../stylesheets/atomic.scss";
import {AppProps} from "next/app";

function App({Component, pageProps}: AppProps) {
	return (
		<ChakraProvider>
			<Component {...pageProps} />
		</ChakraProvider>
	);
}

export default App;
