import {Button, HStack, Table, Tbody, Td, Th, Thead, Tr, VStack} from "@chakra-ui/react";
import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {useRouter} from "next/router";

import {Student} from "../interfaces";

import Layout from "../components/Layout";

import {redirectToHome} from "../src/constants";
import {classNameById} from "../src/database/read/classes";
import {studentsAll} from "../src/database/read/students";
import supabase from "../src/server";

const PAGE_LENGTH = 50;

export const getServerSideProps: GetServerSideProps = async function({query, req}) {
	const {user} = await supabase.auth.api.getUserByCookie(req);

	if (!user) {
		return redirectToHome;
	}

	const page = !isNaN(parseInt(query.page as string)) ? parseInt(query.page as string) : 1

	const allStudents = await studentsAll();

	const students = allStudents.splice((page - 1) * PAGE_LENGTH, page * PAGE_LENGTH);
	const classNames = await Promise.all(students.map(async function(student) {
		return await classNameById(student.class_id);
	}));

	const maxPages = Math.ceil(allStudents.length / 50) + 1;

	return {
		props: {
			classNames,
			maxPages,
			page,
			students
		}
	}
}

function StudentsPage(
	{classNames, maxPages, page, students}: InferGetServerSidePropsType<typeof getServerSideProps>
) {
	const router = useRouter();

	async function prevPage() {
		await router.push(`/students?page=${page - 1}`)
	}

	async function nextPage() {
		await router.push(`/students?page=${page + 1}`)
	}

	return (
		<Layout title="Attendance System (Students)">
			<VStack justify="start">
				<HStack justify="start">
					{page != 1 ? <Button onClick={prevPage} colorScheme="cyan" size="sm">Previous Page</Button> : <></>}
					{page != maxPages ? <Button onClick={nextPage} colorScheme="cyan" size="sm">Next Page</Button> : <></>}
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
							{(students as Student[]).map(function(student, index) {
								async function goTo() {
									await router.push(`/student/${student.student_id}`);
								}

								return (
									<Tr key={student.student_id}>
										<Td>{student.student_id}</Td>
										<Td>{student.student_name}</Td>
										<Td>{classNames[index]}</Td>
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

export default StudentsPage;
