/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {Button, Center, HStack, Input, Table, Tbody, Td, Text, Th, Thead, Tr, VStack} from "@chakra-ui/react";
import {GetServerSideProps} from "next";
import {useRouter} from "next/router";
import React, {useState} from "react";

import {AttendanceUser, Class} from "../src/interfaces";

import Layout from "../components/Layout";

import {redirectToHome} from "../src/constants";
import {classesAll} from "../src/database/read/classes";
import {studentsAllByClassId} from "../src/database/read/students";
import {parseBrowserQuery} from "../src/utils";
import Header from "../components/Header";
import getUser from "../src/auth";

const PAGE_LENGTH = 20;

type Props = {
	classes: Class[],
	maxPages: number,
	page: number,
	search: string,
	students: number[],
	user: AttendanceUser
};

export const getServerSideProps: GetServerSideProps = async function({query, req}) {
	const user = await getUser(req);
	if (!user) {
		return redirectToHome;
	}

	const {page, search} = parseBrowserQuery(query);
	const lowerCaseSearch = search.toLowerCase();

	const allClasses = await classesAll();
	const filteredClasses = allClasses.filter(function(class_) {
		return search === "" || class_.class_id.toString().toLowerCase().includes(lowerCaseSearch) || class_.class_name.toLowerCase().includes(lowerCaseSearch);
	});
	const classes = filteredClasses.splice((page - 1) * PAGE_LENGTH, page * PAGE_LENGTH);
	const students = await Promise.all(classes.map(async function(class_) {
		return (await studentsAllByClassId(class_.class_id)).length;
	}));

	const maxPages = Math.ceil(filteredClasses.length / 50) + 1;

	return {
		props: {
			classes,
			maxPages,
			page,
			search,
			students,
			user
		}
	};
}

function Classes({classes, maxPages, page, search, students, user}: Props) {
	const router = useRouter();
	const [query, setQuery] = useState(search);

	async function prevPage() {
		await router.push(`/classes?page=${page - 1}&q=${query}`)
	}

	async function nextPage() {
		await router.push(`/classes?page=${page + 1}&q=${query}`)
	}

	async function handleSearch() {
		await router.push(`/classes?page=1&q=${query}`);
	}

	return classes.length === 0 ? (
		<Layout title="Attendance System (Classes)">
			<VStack justify="start">
				<Header user={user}/>
				<HStack>
					<Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" colorScheme="blue" size="sm"/>
					<Button onClick={handleSearch} colorScheme="blue">Search</Button>
				</HStack>
				<HStack>
					<Text><Center>No Results</Center></Text>
				</HStack>
			</VStack>
		</Layout>
	) : (
		<Layout title="Attendance System (Classes)">
			<VStack justify="start">
				<HStack justify="start">
					{page != 1 ? <Button onClick={prevPage} colorScheme="cyan" size="sm">Previous Page</Button> : <></>}
					{page != maxPages ? <Button onClick={nextPage} colorScheme="cyan" size="sm">Next Page</Button> : <></>}
				</HStack>
				<HStack>
					<Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" colorScheme="blue" size="sm"/>
					<Button onClick={handleSearch} colorScheme="blue">Search</Button>
				</HStack>
				<HStack justify="start">
					<Table colorScheme="blue" size="sm">
						<Thead>
							<Tr>
								<Th>Class ID</Th>
								<Th>Name</Th>
								<Th>Level ID</Th>
								<Th>Students</Th>
								<Th/>
							</Tr>
						</Thead>
						<Tbody>
							{classes.map(function (class_, index) {
								async function goTo() {
									await router.push(`/class/${class_.class_id}`);
								}

								return (
									<Tr key={class_.class_id}>
										<Td>{class_.class_id}</Td>
										<Td>{class_.class_name}</Td>
										<Td>{class_.level_id}</Td>
										<Td>{students[index]}</Td>
										<Td><Button onClick={goTo} colorScheme="blue" size="sm">Go to Class</Button>
										</Td>
									</Tr>
								);
							})}
						</Tbody>
					</Table>
				</HStack>
				<HStack justify="start">
					{page != 1 ? <Button onClick={prevPage} colorScheme="cyan" size="sm">Previous Page</Button> : <></>}
					{page != maxPages ? <Button onClick={nextPage} colorScheme="cyan" size="sm">Next Page</Button> : <></>}
				</HStack>
			</VStack>
		</Layout>
	);
}

export default Classes;
