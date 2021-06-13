import {Button, Center, HStack, Input, Text, VStack} from "@chakra-ui/react";
import {Session, User} from "@supabase/supabase-js";
import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";

import Layout from "../components/Layout";
import GoogleLogo from "../components/logos/Google";

import anonSupabase from "../src/client";

import "tachyons/css/tachyons.min.css";

function IndexPage() {
	const router = useRouter();

	const [user, setUser] = useState<User | null>(null);
	const setSession = useState<Session | null>(null)[1];

	const [studentId, setStudentId] = useState("");
	const [classId, setClassId] = useState("");

	const [invalidStudentId, setInvalidStudentId] = useState(false);
	const [invalidClassId, setInvalidClassId] = useState(false);

	useEffect(function () {
		const authSession = anonSupabase.auth.session();
		setSession(authSession);
		setUser(authSession?.user ?? null);

		const {data: authListener} = anonSupabase.auth.onAuthStateChange(async function (event, authSession) {
			console.log(`Supabase Auth Event: ${event}`);

			await fetch('/api/auth', {
				method: "POST",
				headers: new Headers({
					"Content-Type": "application/json"
				}),
				credentials: "same-origin",
				body: JSON.stringify({
					event,
					session: authSession
				})
			});

			setSession(authSession);
			setUser(authSession?.user ?? null);
		});

		return function () {
			authListener?.unsubscribe();
		}
	}, []);

	async function signIn() {
		await anonSupabase.auth.signIn({
			provider: "google"
		});
	}

	async function signOut() {
		await anonSupabase.auth.signOut();
		setSession(null);
		setUser(null);
	}

	async function goToStudent() {
		if (studentId !== "") {
			const res = await fetch(`/api/student/${studentId}`, {
				method: "GET",
				headers: new Headers({
					"Content-Type": "application/json"
				}),
				credentials: "same-origin"
			});
			if (res.status === 200) {
				setInvalidStudentId(false);
				await router.push(`/student/${studentId}`);
			} else {
				setInvalidStudentId(true);
			}
		}
	}

	async function goToClass() {
		if (classId !== "") {
			const res = await fetch(`/api/class/${classId}`, {
				method: "GET",
				credentials: "same-origin"
			});
			if (res.status === 200) {
				setInvalidClassId(false);
				await router.push(`/class/${classId}`);
			} else {
				setInvalidClassId(true);
			}
		}
	}

	return !user ? (
		<Layout title="Attendance System (Sign In)">
			<Center h="100vh">
				<Button onClick={signIn} leftIcon={<GoogleLogo colour="#2A4365"/>} colorScheme="blue">
					Sign In with Google
				</Button>
			</Center>
		</Layout>
	) : (
		<Layout title="Attendance System">
			<VStack h="100vh" justify="start">
				<HStack w="100vw" justify="end" spacing={4} isInline>
					<Text>{user.email?.split("@")[0]}</Text>
					<Button onClick={signOut} colorScheme="blue">Sign Out</Button>
				</HStack>
				<VStack w="100vw" justify="start" spacing={3}>
					<HStack spacing={3} isInline>
						<Text>Student: </Text>
						{invalidStudentId ? (
							<Input value={studentId} onChange={(event) => setStudentId(event.target.value)} resize="none" placeholder="Student ID" colorScheme="blue" size="sm" borderColor="red"/>
						) : (
							<Input value={studentId} onChange={(event) => setStudentId(event.target.value)} resize="none" placeholder="Student ID" colorScheme="blue" size="sm"/>
						)}
						<Button onClick={goToStudent} colorScheme="blue">Go to</Button>
						<Button onClick={async () => await router.push("/students?page=1")} colorScheme="blue">Browse</Button>
					</HStack>
					<HStack spacing={3} isInline>
						<Text>Class: </Text>
						{invalidClassId ? (
							<Input value={classId} onChange={(event) => setClassId(event.target.value)} resize="none" placeholder="Class ID" colorScheme="blue" size="sm" borderColor="red"/>
						) : (
							<Input value={classId} onChange={(event) => setClassId(event.target.value)} resize="none" placeholder="Class ID" colorScheme="blue" size="sm"/>
						)}
						<Button onClick={goToClass} colorScheme="blue">Go to</Button>
						<Button onClick={async () => await router.push("/classes?page=1")} colorScheme="blue">Browse</Button>
					</HStack>
				</VStack>
			</VStack>
		</Layout>
	);
}

export default IndexPage;
