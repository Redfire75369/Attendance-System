import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {useRouter} from "next/router";

import {Class} from "../interfaces";

import Layout from "../components/Layout";

import supabase from "../src/server";
import {classesAll} from "../src/database/read/classes";

const PAGE_LENGTH = 20;

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

	const allClasses = await classesAll();

	const classes = allClasses.splice((page - 1) * PAGE_LENGTH, page * PAGE_LENGTH);

	const maxPages = Math.ceil(allClasses.length / 50) + 1;

	return {
		props: {
			classes,
			maxPages,
			page
		}
	}
}

function ClassesPage(
	{classes, maxPages, page}: InferGetServerSidePropsType<typeof getServerSideProps>
) {
	const router = useRouter();

	async function prevPage() {
		await router.push(`/classes?page=${page - 1}`)
	}

	async function nextPage() {
		await router.push(`/classes?page=${page + 1}`)
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
					<td>Class ID</td>
					<td>Name</td>
					<td>Level ID</td>
				</tr>
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
