/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {Button, Center, HStack, Input, Table, Tbody, Td, Text, Th, Thead, Tr, VStack} from "@chakra-ui/react";
import {GetServerSideProps} from "next";
import {useRouter} from "next/router";
import React, {useState} from "react";

import {AttendanceUser, StudentWithClassName} from "../src/interfaces";

import Layout from "../components/Layout";

import {redirectToHome} from "../src/constants";
import {studentsWithClassNamesAll} from "../src/database/read/students";
import {parseBrowserQuery} from "../src/utils";
import getUser from "../src/auth";
import Header from "../components/Header";

const PAGE_LENGTH = 50;

type Props = {
	maxPages: number,
	page: number,
	search: string,
	students: StudentWithClassName[],
	user: AttendanceUser
};

export const getServerSideProps: GetServerSideProps = async function({query, req}) {
	const user = await getUser(req);
	if (!user) {
		return redirectToHome;
	}

	const {page, search} = parseBrowserQuery(query);
	const lowerCaseSearch = search.toLowerCase();

	const allStudents = await studentsWithClassNamesAll();

	const filteredStudents = allStudents.filter(function(student) {
		return lowerCaseSearch === "" || student.student_id.toLowerCase().includes(lowerCaseSearch) || student.student_name.toLowerCase().includes(lowerCaseSearch) || student.class.class_name.toLowerCase().includes(lowerCaseSearch);
	});
	const students = filteredStudents.splice((page - 1) * PAGE_LENGTH, page * PAGE_LENGTH);

	const maxPages = Math.ceil(filteredStudents.length / 50) + 1;

	return {
		props: {
			maxPages,
			page,
			search,
			students,
			user
		}
	};
}

function Students({maxPages, page, search, students, user}: Props) {
	const router = useRouter();
	const [query, setQuery] = useState(search);

	async function prevPage() {
		await router.push(`/students?page=${page - 1}`)
	}

	async function nextPage() {
		await router.push(`/students?page=${page + 1}`)
	}

	async function handleSearch() {
		await router.push(`/students?page=1&q=${query}`);
	}

	return students.length === 0 ? (
		<Layout title="Attendance System (Students)">
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
		<Layout title="Attendance System (Students)">
			<VStack justify="start">
				<Header user={user}/>
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
								<Th>Student ID</Th>
								<Th>Name</Th>
								<Th>Class</Th>
								<Th/>
							</Tr>
						</Thead>
						<Tbody>
							{students.map(function(student) {
								async function goTo() {
									await router.push(`/student/${student.student_id}`);
								}

								return (
									<Tr key={student.student_id}>
										<Td>{student.student_id}</Td>
										<Td>{student.student_name}</Td>
										<Td>{student.class.class_name}</Td>
										<Td><Button onClick={goTo} colorScheme="blue" size="sm">Go to Student</Button></Td>
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

export default Students;
