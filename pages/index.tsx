import {Button, Center, HStack, Input, Text, VStack} from "@chakra-ui/react";
import {Session, User} from "@supabase/supabase-js";
import {useRouter} from "next/router";
import React, {useState, useEffect, useRef} from "react";

import Layout from "../components/Layout";
import GoogleLogo from "../components/logos/Google";

import anonSupabase from "../src/client";

import "tachyons/css/tachyons.min.css";

function IndexPage() {
	const router = useRouter();

	const [user, setUser] = useState<User | null>(null);
	const setSession = useState<Session | null>(null)[1];

	const studentRef = useRef<HTMLInputElement>(null);
	const classRef = useRef<HTMLInputElement>(null);

	useEffect(function () {
		const authSession = anonSupabase.auth.session();
		setSession(authSession);
		setUser(authSession?.user ?? null);

		const {data: authListener} = anonSupabase.auth.onAuthStateChange(
			async function (event, authSession) {
				console.log(`Supabase Auth Event: ${event}`);

				// This is what forwards the session to our auth API route which sets/deletes the cookie:
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

				setSession(authSession)
				setUser(authSession?.user ?? null);
			}
		)

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
		const id = studentRef.current?.value;
		if (id) {
			await router.push(`/student/${id}`);
		}
	}
	async function browseStudents() {
		await router.push(`/students?page=1`);
	}

	async function goToClass() {
		const id = classRef.current?.value;
		if (id) {
			await router.push(`/class/${id}`);
		}
	}
	async function browseClasses() {
		await router.push(`/classes?page=1`);
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
				<VStack justify="start" spacing={3}>
					<HStack spacing={3}>
						<Text>Student: </Text>
						<Input ref={studentRef} resize="none" placeholder="Student ID" colorScheme="blue" size="sm"/>
						<Button onClick={goToStudent} colorScheme="blue">Go to</Button>
						<Button onClick={browseStudents} colorScheme="blue">Browse</Button>
					</HStack>
					<HStack spacing={3}>
						<Text>Class: </Text>
						<Input ref={classRef} resize="none" placeholder="Class ID" colorScheme="blue" size="sm"/>
						<Button onClick={goToClass} colorScheme="blue">Go to</Button>
						<Button onClick={browseClasses} colorScheme="blue">Browse</Button>
					</HStack>
				</VStack>
			</VStack>
		</Layout>
	);
}

export default IndexPage;
