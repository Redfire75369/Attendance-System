import React, {ReactNode} from 'react'
import Head from 'next/head'

type Props = {
	children?: ReactNode
	title?: string
}

function Layout({children, title = "Default Title"}: Props) {
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
