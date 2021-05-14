import Head from "next/head";
import React, {ReactNode} from "react";

type Props = {
	children?: ReactNode
	title?: string
}

function Layout({children, title = "Attendance System"}: Props) {
	return (
		<div>
			<Head>
				<title>{title}</title>
				<meta charSet="utf-8"/>
				<meta name="viewport" content="initial-scale=1.0, width=device-width"/>
			</Head>
			{children}
		</div>
	);
}

export default Layout;
