import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {useRouter} from "next/router";

import {Student} from "../interfaces";

import Layout from "../components/Layout";

import supabase from "../src/server";
import {classNameById} from "../src/database/read/classes";
import {studentsAll} from "../src/database/read/students";

const PAGE_LENGTH = 50;

export const getServerSideProps: GetServerSideProps = async function({query, req}) {
	const { user } = await supabase.auth.api.getUserByCookie(req);

	if (!user) {
		return {
			redirect: {
				destination: "/",
				permanent: false
			}
		}
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
		<Layout>
			<div>
				{page != 1 ? <button onClick={prevPage}>Previous Page</button> : <></>}
				{page != maxPages ? <button onClick={nextPage}>Next Page</button> : <></>}
			</div>
			<table>
				<tbody>
					<tr>
						<td>Student ID</td>
						<td>Name</td>
						<td>Class</td>
					</tr>
					{(students as Student[]).map(function(student, index) {
						async function goTo() {
							await router.push(`/student/${student.student_id}`);
						}

						return (
							<tr key={student.student_id}>
								<td>{student.student_id}</td>
								<td>{student.student_name}</td>
								<td>{classNames[index]}</td>
								<td>
									<button onClick={goTo}>
										Go to Student
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

export default StudentsPage;
