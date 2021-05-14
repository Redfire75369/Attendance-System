import {Session, User} from "@supabase/supabase-js";
import React, { useState, useEffect } from "react";

import Layout from "../components/Layout";

import anonSupabase from "../src/client";

function IndexPage() {
	const [user, setUser] = useState<User | null>(null);
	const setSession = useState<Session | null>(null)[1];

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
			</>
		</Layout>
	);
}

export default IndexPage;
