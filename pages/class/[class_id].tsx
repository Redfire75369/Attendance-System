import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {useRouter} from "next/router";
import React, {ChangeEvent, useRef, useState} from "react";

import {Attendance} from "../../interfaces";

import DataLabel from "../../components/DataLabel";
import Layout from "../../components/Layout";

import supabase from "../../src/server";
import {getStudentAttendanceOnDates} from "../../src/attendance";
import {classById} from "../../src/database/read/classes";
import {studentsAllByClassId} from "../../src/database/read/students";
import {getISODate} from "../../src/date";
import {getDaysInRange, parseDateRangeInQuery} from "../../src/date_range";

export const getServerSideProps: GetServerSideProps = async function({params, query, req}) {
	const {user} = await supabase.auth.api.getUserByCookie(req);

	if (!user) {
		return {
			redirect: {
				destination: "/",
				permanent: false
			}
		}
	}

	const id = parseInt(params?.class_id as string);
	const class_ = await classById(id);

	if (!class_) {
		return {
			redirect: {
				destination: "/",
				permanent: false
			}
		}
	}

	const students = await studentsAllByClassId(id);

	const [start, end] = parseDateRangeInQuery(query);
	const dates = getDaysInRange(7, [start, end]);

	const attendances = await Promise.all(students.map(async function(student) {
		return await getStudentAttendanceOnDates(student.student_id, dates);
	}));

	return {
		props: {
			attendances,
			class_,
			students
		}
	}
}

function ClassAttendancePage(
	{attendances, class_, students}: InferGetServerSidePropsType<typeof getServerSideProps>
) {
	const dates = Object.keys(attendances[0]).map(d => new Date(d));

	const router = useRouter();
	const [data, setData] = useState<Attendance[]>(attendances);

	const modifications = useRef<{[key: string]: Attendance}>({});
	const startRef = useRef<HTMLInputElement>(null);
	const endRef = useRef<HTMLInputElement>(null);

	async function updateDates() {
		const start = startRef.current?.value;
		const end = endRef.current?.value;
		if (start && end) {
			await router.push(`/class/${class_.class_id}?start=${start}&end=${end}`);
		}
	}

	async function updateAttendance() {
		await fetch(`/api/class/${class_.class_id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(modifications.current)
		});
		window.location.reload();
	}

	return (
		<Layout title="Student Attendance">
			<div>
				<div>
					<label htmlFor="start">From: </label>
					<input type="date" name="start" id="start-date" defaultValue={getISODate(dates[0])} ref={startRef}/>
				</div>
				<div>
					<label htmlFor="end">To: </label>
					<input type="date" name="end" id="end-date" defaultValue={getISODate(dates[dates.length - 1])} ref={endRef}/>
				</div>
				<div>
					<button onClick={updateDates}>Dates</button>
				</div>
			</div>
			<table>
				<tbody>
					<DataLabel dates={dates}/>
					{data.map((attendance, index) => {
						let student = students[index];

						return (
							<tr key={student.student_id}>
								<td>{student.student_id}</td>
								<td>{student.student_name}</td>
								<td>{class_.class_name}</td>
								{dates.map((date) => {
									function handleChange(event: ChangeEvent<HTMLInputElement>) {
										if (!modifications.current[student.student_id]) {
											modifications.current[student.student_id] = {};
										}
										modifications.current[student.student_id][date.toString()] = event.target.checked;

										const newData = [...data];
										newData[index][date.toString()] = event.target.checked;
										setData(newData);
									}

									return attendance[date.toString()] ? (
										<td key={date.toString()}>
											<input type="checkbox" onChange={handleChange} autoComplete="off" checked/>
										</td>
									) : (
										<td key={date.toString()}>
											<input type="checkbox" onChange={handleChange} autoComplete="off"/>
										</td>
									);
								})}
							</tr>
						);
					})}
				</tbody>
			</table>
			<div>
				<button type="submit" onClick={() => updateAttendance()}>Submit</button>
			</div>
		</Layout>
	);
}

export default ClassAttendancePage;
