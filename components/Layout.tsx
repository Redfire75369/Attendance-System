import Head from "next/head";
import React, {ReactNode} from "react";

type Props = {
	children?: ReactNode
	title?: string
}

function Layout({children, title = "Attendance System"}: Props) {
	return (
		<>
			<Head>
				<title>{title}</title>
				<meta charSet="utf-8"/>
				<meta name="viewport" content="initial-scale=1.0, width=device-width"/>
			</Head>
			{children}
		</>
	);
}

export default Layout;
