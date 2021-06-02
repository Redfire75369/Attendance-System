import {Button, HStack, Table, Tbody, Td, Th, Thead, Tr, VStack} from "@chakra-ui/react";
import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {useRouter} from "next/router";

import {Class} from "../interfaces";

import Layout from "../components/Layout";

import {redirectToHome} from "../src/constants";
import {classesAll} from "../src/database/read/classes";
import {studentsAllByClassId} from "../src/database/read/students";
import supabase from "../src/server";

const PAGE_LENGTH = 20;

export const getServerSideProps: GetServerSideProps = async function({query, req}) {
	const {user} = await supabase.auth.api.getUserByCookie(req);

	if (!user) {
		return redirectToHome;
	}

	const page = !isNaN(parseInt(query.page as string)) ? parseInt(query.page as string) : 1

	const allClasses = await classesAll();

	const classes = allClasses.splice((page - 1) * PAGE_LENGTH, page * PAGE_LENGTH);
	const students = await Promise.all(classes.map(async function(class_) {
		return (await studentsAllByClassId(class_.class_id)).length;
	}));

	const maxPages = Math.ceil(allClasses.length / 50) + 1;

	return {
		props: {
			classes,
			maxPages,
			page,
			students
		}
	}
}

function ClassesPage(
	{classes, maxPages, page, students}: InferGetServerSidePropsType<typeof getServerSideProps>
) {
	const router = useRouter();

	async function prevPage() {
		await router.push(`/classes?page=${page - 1}`)
	}

	async function nextPage() {
		await router.push(`/classes?page=${page + 1}`)
	}

	return (
		<Layout title="Attendance System (Classes)">
			<VStack justify="start">
				<HStack justify="start">
					{page != 1 ? <Button onClick={prevPage} colorScheme="cyan" size="sm">Previous Page</Button> : <></>}
					{page != maxPages ? <Button onClick={nextPage} colorScheme="cyan" size="sm">Next Page</Button> : <></>}
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
							{(classes as Class[]).map(function (class_, index) {
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

	return (
		<Layout>
			<table>
				<tbody>
				{(classes as Class[]).map(function (class_) {
					async function goTo() {
						await router.push(`/class/${class_.class_id}`);
					}

					return (
						<tr key={class_.class_id}>
							<td>{class_.class_id}</td>
							<td>{class_.class_name}</td>
							<td>{class_.level_id}</td>
							<td>
								<button onClick={goTo}>
									Go to Class
								</button>
							</td>
						</tr>
					);
				})}
				</tbody>
			</table>
			<div>
				{page != 1 ? <button onClick={prevPage}>Previous Page</button> : <></>}
				{page != maxPages ? <button onClick={nextPage}>Next Page</button> : <></>}
			</div>
		</Layout>
	);
}

export default ClassesPage;
