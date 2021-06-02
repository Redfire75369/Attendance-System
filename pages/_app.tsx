import {ChakraProvider} from "@chakra-ui/react"

import "../stylesheets/atomic.scss";

// @ts-ignore
function App({Component, pageProps}) {
	return (
		<ChakraProvider>
			<Component {...pageProps} />
		</ChakraProvider>
	);
}

export default App;
