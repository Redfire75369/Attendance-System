/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {Button, HStack, Text} from "@chakra-ui/react";
import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";

import anonSupabase from "../src/client";
import {AttendanceUser} from "../src/interfaces";

type Props = {
	user: AttendanceUser
};

function Header({user}: Props) {
	const router = useRouter();

	const  [path, setPath] = useState("/admin/dashboard");

	useEffect(function() {
		setPath(window.location.pathname);
	});

	async function signOut() {
		await anonSupabase.auth.signOut();
		window.location.reload();
	}

	return (
		<HStack w="100vw" justify="end" spacing={4} isInline>
			{user.permissions.admin && path !== "/admin/dashboard" ? <Button onClick={async () => router.push("/admin/dashboard")}>Dashboard</Button> : <></>}
			<Text>{user.email?.split("@")[0]}</Text>
			<Button onClick={signOut} colorScheme="blue">Sign Out</Button>
		</HStack>
	);
}

export default Header;
