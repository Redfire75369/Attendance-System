import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {useRouter} from "next/router";
import React, {ChangeEvent, useRef, useState} from "react";

import {Attendance} from "../../interfaces";

import Layout from "../../components/Layout";
import DataLabel from "../../components/DataLabel";

import supabase from "../../src/server";
import {getStudentAttendanceOnDates} from "../../src/attendance";
import {studentById} from "../../src/database/read/students";
import {classNameById} from "../../src/database/read/classes";
import {getISODate} from "../../src/date";
import {getDaysInRange, parseDateRangeInQuery} from "../../src/date_range";

export const getServerSideProps: GetServerSideProps = async function({params, query, req}) {
	const { user } = await supabase.auth.api.getUserByCookie(req);

	if (!user) {
		return {
			redirect: {
				destination: "/",
				permanent: false
			}
		}
	}

	const id = params?.student_id as string;
	const student = await studentById(id);

	if (!student) {
		return {
			redirect: {
				destination: "/",
				permanent: false
			}
		}
	}

	const className = await classNameById(student.class_id);

	const [start, end] = parseDateRangeInQuery(query);
	const dates = getDaysInRange(7, [start, end]);

	const attendance = await getStudentAttendanceOnDates(id, dates);

	return {
		props: {
			attendance,
			className,
			student
		}
	}
}

function StudentAttendancePage(
	{attendance, className, student}: InferGetServerSidePropsType<typeof getServerSideProps>
) {
	const dates = Object.keys(attendance).map(d => new Date(d));
	const present = dates.reduce(function(prev, date) {
		return prev + (attendance[date.toString()] ? 1 : 0);
	}, 0);

	const router = useRouter();
	const [data, setData] = useState<Attendance>(attendance);

	const modifications = useRef<Attendance>({});
	const startRef = useRef<HTMLInputElement>(null);
	const endRef = useRef<HTMLInputElement>(null);

	async function updateDates() {
		const start = startRef.current?.value;
		const end = endRef.current?.value;
		if (start && end) {
			await router.push(`/student/${student.student_id}?start=${start}&end=${end}`);
		}
	}

	async function updateAttendance() {
		await fetch(`/api/student/${student.student_id}`, {
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
			<div>
				Total Attendance: {dates.length} ({present} Present)
			</div>
			<table>
				<tbody>
					<DataLabel dates={dates}/>
					<tr>
						<td>{student.student_id}</td>
						<td>{student.student_name}</td>
						<td>{className}</td>
						{dates.map((date) => {
							function handleChange(event: ChangeEvent<HTMLInputElement>) {
								modifications.current[date.toString()] = event.target.checked;
								setData({
									...data,
									[date.toString()]: event.target.checked
								});
							}

							return data[date.toString()] ? (
								<td key={date.toString()}>
									<input type="checkbox" onChange={handleChange} autoComplete="off" checked/>
								</td>
							) : (
								<td key={date.toString()}>
									<input type="checkbox" onChange={handleChange} autoComplete="off"/>
								</td>
							);
						})}
						<td key="submit">
							<button type="submit" onClick={() => updateAttendance()}>Submit</button>
						</td>
					</tr>
				</tbody>
			</table>
		</Layout>
	);
}

export default StudentAttendancePage;
