import {Session, User} from "@supabase/supabase-js";
import {useRouter} from "next/router";
import React, {useState, useEffect, useRef} from "react";

import Layout from "../components/Layout";

import anonSupabase from "../src/client";

function IndexPage() {
	const router = useRouter();

	const [user, setUser] = useState<User | null>(null);
	const setSession = useState<Session | null>(null)[1];

	const studentRef = useRef<HTMLInputElement>(null);
	const classRef = useRef<HTMLInputElement>(null);

	useEffect(function() {
		const authSession = anonSupabase.auth.session();
		setSession(authSession);
		setUser(authSession?.user ?? null);

		const { data: authListener } = anonSupabase.auth.onAuthStateChange(
			async function(event, authSession) {
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

		return function() {
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
		<Layout title="Sign In">
			<button onClick={signIn}>
				Sign In
			</button>
		</Layout>
	) : (
		<Layout title="Welcome!">
			<>
				<div>
					Welcome {user.email}!
				</div>
				<div>
					<button onClick={signOut}>
						Sign Out
					</button>
				</div>
				<div>
					<input type="text" ref={studentRef} placeholder="Student ID"/>
					<button onClick={goToStudent}>Go to Student</button>
					<button onClick={browseStudents}>Browse Students</button>
				</div>
				<div>
					<input type="text" ref={classRef} placeholder="Class ID"/>
					<button onClick={goToClass}>Go to Class</button>
					<button onClick={browseClasses}>Browse Classes</button>
				</div>
			</>
		</Layout>
	);
}

export default IndexPage;
