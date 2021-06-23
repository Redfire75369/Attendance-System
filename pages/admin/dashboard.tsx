/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {redirectToHome} from "../../src/constants";
import {GetServerSideProps} from "next";
import Layout from "../../components/Layout";
import getUser from "../../src/auth";
import {Button, HStack, VStack} from "@chakra-ui/react";
import {AttendanceUser} from "../../src/interfaces";
import Header from "../../components/Header";
import {useRouter} from "next/router";

type Props = {
	user: AttendanceUser
};

export const getServerSideProps: GetServerSideProps = async function({req}) {
	const user = await getUser(req);
	if (!user || !user.permissions.admin) {
		return redirectToHome;
	}

	return {
		props: {
			user
		}
	};
}

function Dashboard({user}: Props) {
	const router = useRouter();

	return (
		<Layout>
			<VStack justify="center">
				<Header user={user}/>
				<HStack>
					<Button onClick={() => router.push("/admin/dashboard/student")}>Add/Edit Students</Button>
					<Button onClick={() => router.push("/admin/dashboard/class")}>Add/Edit Classes</Button>
				</HStack>
			</VStack>
		</Layout>
	);
}

export default  Dashboard;
